namespace MeiManager.Domain.Entities;

public class Appointment : BaseEntity
{
    public int UserId { get; set; }
    public int ClientId { get; set; }
    public int? ServiceId { get; set; }

    public DateTime Date { get; set; }
    public string Status { get; set; } = "scheduled";
    public string? Notes { get; set; }

    // Relacionamentos
    public User User { get; set; } = null!;
    public Client Client { get; set; } = null!;
    public Service? Service { get; set; }
}