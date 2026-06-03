using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CarolinaRunningClub.Backend.Data;
using CarolinaRunningClub.Backend.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace CarolinaRunningClub.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private const string SecretKey = "CarolinaRunningClubSuperSecretSecureKey123!";

        // Memorie cache temporară pentru codurile de autentificare OTP
        private static readonly Dictionary<string, string> _loginOtpStore = new();

        public AuthController(AppDbContext context)
        {
            _context = context;
        }


        // PASUL 1: Verifică Email + Parolă -> Generează și trimite codul OTP pe Email
        [HttpPost("send-login-otp")]
        public async Task<IActionResult> SendLoginOtp([FromBody] OtpRequest request)
        {
            if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
                return BadRequest("Email-ul și parola sunt obligatorii.");

            string normalizedEmail = request.Email.ToLower().Trim();

            // Caută utilizatorul în baza de date (atât conturile seed-uite, cât și cele noi înregistrate)
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == normalizedEmail);

            // Verificare de siguranță pentru admin-ul principal
            if (normalizedEmail == "hidan.vlad@test.com" && request.Password == "1234") { /* Permis */ }
            else if (user == null || user.Password != request.Password)
            {
                return Unauthorized("Adresa de email sau parola este incorectă.");
            }

            // Generează un cod OTP din 6 cifre
            string generatedOtp = new Random().Next(100000, 999999).ToString();
            _loginOtpStore[normalizedEmail] = generatedOtp;


            Console.WriteLine($"[PASUL 2] OUTBOUND SECURITY GATEWAY - SIMULARE EMAIL");
            Console.WriteLine($"Către: {normalizedEmail}");
            Console.WriteLine($"Subiect: Codul tău de verificare securizată CRC");
            Console.WriteLine($"Mesaj: Salut! Codul tău din 6 cifre pentru autentificare este: {generatedOtp}");

            return Ok(new { message = "Codul OTP a fost generat cu succes în consola serverului." });
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (string.IsNullOrEmpty(request.Email))
                return BadRequest("Email-ul este obligatoriu.");

            string normalizedEmail = request.Email.ToLower().Trim();

            // Verifică dacă codul introdus coincide cu cel din memorie
            if (!_loginOtpStore.TryGetValue(normalizedEmail, out string? correctOtp) || correctOtp != request.SecurityPassphrase.Trim())
                return Unauthorized("Codul OTP este incorect sau a expirat.");

            int userId = 1;
            string userName = "Membru Club";
            string userRole = "User";

            var dbUser = await _context.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == normalizedEmail);
            if (dbUser != null)
            {
                userId = dbUser.Id;
                userName = dbUser.Name;
                userRole = normalizedEmail == "hidan.vlad@test.com" ? "Admin" : "User";
            }
            else if (normalizedEmail == "hidan.vlad@test.com")
            {
                userName = "Admin Vlad";
                userRole = "Admin";
            }

            // Consumă codul OTP din cache
            _loginOtpStore.Remove(normalizedEmail);

            // Generare Token JWT pentru sesiune securizată
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(SecretKey);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
                    new Claim(ClaimTypes.Name, userName),
                    new Claim(ClaimTypes.Email, normalizedEmail),
                    new Claim(ClaimTypes.Role, userRole)
                }),
                Expires = DateTime.UtcNow.AddHours(2),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            return Ok(new
            {
                Token = tokenString,
                User = new { id = userId, name = userName, email = normalizedEmail, role = userRole }
            });
        }


        // RECUPERARE PASUL 1: Extrage Întrebarea de Siguranță din DB pe baza Email-ului
        [HttpPost("get-question")]
        public async Task<IActionResult> GetSecurityQuestion([FromBody] ForgotPasswordRequest request)
        {
            if (string.IsNullOrEmpty(request.Email)) return BadRequest("Email required.");

            string normalizedEmail = request.Email.ToLower().Trim();
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == normalizedEmail);

            if (user == null && normalizedEmail != "hidan.vlad@test.com")
                return NotFound("Adresa de email nu a fost găsită în baza de date.");

            // Returnează întrebarea setată la înregistrare din SQL Server
            string question = user?.SecurityQuestion ?? "Care este numele animalului tău de companie? (Indiciu implicit: Rex)";
            return Ok(new { question });
        }

        // RECUPERARE PASUL 2: Validează Răspunsul și salvează Noua Parolă în SQL Server
        [HttpPost("recover-password")]
        public async Task<IActionResult> RecoverPassword([FromBody] RecoverPasswordRequest request)
        {
            string normalizedEmail = request.Email.ToLower().Trim();
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == normalizedEmail);

            string dbAnswer = user?.SecurityAnswer ?? "Rex";

            // Verificare case-insensitive și trim a răspunsului
            if (dbAnswer.ToLower().Trim() != request.Answer.ToLower().Trim())
            {
                return BadRequest("Răspunsul la întrebarea de siguranță este incorect.");
            }

            // Actualizează proprietatea în tabelă dacă utilizatorul există în DB
            if (user != null)
            {
                user.Password = request.NewPassword;
                await _context.SaveChangesAsync(); // Salvează fizic noua parolă în SQL Server
            }

            return Ok(new { message = "Parola a fost actualizată cu succes!" });
        }
    }

    public class OtpRequest { public string Email { get; set; } = null!; public string Password { get; set; } = null!; }
    public class LoginRequest { public string Email { get; set; } = null!; public string Password { get; set; } = null!; public string SecurityPassphrase { get; set; } = null!; }
    public class ForgotPasswordRequest { public string Email { get; set; } = null!; }
    public class RecoverPasswordRequest { public string Email { get; set; } = null!; public string Answer { get; set; } = null!; public string NewPassword { get; set; } = null!; }
}