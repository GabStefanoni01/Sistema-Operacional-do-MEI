namespace MeiManager.Domain.Entities;

public class User : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string? Profession { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Relacionamentos
    public ICollection<Client> Clients { get; set; } = new List<Client>();
    public ICollection<Service> Services { get; set; } = new List<Service>();
    public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
    public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
}