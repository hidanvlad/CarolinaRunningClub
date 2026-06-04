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

        public AuthController(AppDbContext context)
        {
            _context = context;
        }

        // Metodă păstrată doar pentru compatibilitatea rutelor vechi, nu mai este necesară în fluxul nou
        [HttpPost("send-login-otp")]
        public IActionResult SendLoginOtp([FromBody] OtpRequest request)
        {
            return Ok(new { message = "Metodă dezactivată. Logarea se face direct acum." });
        }

        // LOGARE DIRECTĂ: Verifică direct Email + Parolă în SQL Server și emite Token-ul JWT
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
                return BadRequest("Email-ul și parola sunt obligatorii.");

            string normalizedEmail = request.Email.ToLower().Trim();

            // Caută utilizatorul în baza de date
            var dbUser = await _context.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == normalizedEmail);

            // Verificare de siguranță pentru admin-ul principal hardcodat sau utilizatorul din DB
            bool isExplicitAdmin = normalizedEmail == "hidan.vlad@test.com" && request.Password == "1234";

            if (!isExplicitAdmin && (dbUser == null || dbUser.Password != request.Password))
            {
                return Unauthorized("Adresa de email sau parola este incorectă.");
            }

            int userId = 1;
            string userName = "Membru Club";
            string userRole = "User";

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

            if (dbAnswer.ToLower().Trim() != request.Answer.ToLower().Trim())
            {
                return BadRequest("Răspunsul la întrebarea de siguranță este incorect.");
            }

            if (user != null)
            {
                user.Password = request.NewPassword;
                await _context.SaveChangesAsync();
            }

            return Ok(new { message = "Parola a fost actualizată cu succes!" });
        }
    }

    public class OtpRequest { public string Email { get; set; } = null!; public string Password { get; set; } = null!; }
    public class LoginRequest { public string Email { get; set; } = null!; public string Password { get; set; } = null!; public string SecurityPassphrase { get; set; } = ""; }
    public class ForgotPasswordRequest { public string Email { get; set; } = null!; }
    public class RecoverPasswordRequest { public string Email { get; set; } = null!; public string Answer { get; set; } = null!; public string NewPassword { get; set; } = null!; }
}