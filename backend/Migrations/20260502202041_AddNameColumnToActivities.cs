using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CarolinaRunningClub.Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddNameColumnToActivities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "RunActivities",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Name",
                table: "RunActivities");
        }
    }
}
