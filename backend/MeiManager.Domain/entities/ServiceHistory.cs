namespace MeiManager.Domain.Entities;

public class ServiceHistory : BaseEntity
{
    public int UserId { get; set; }
    public int ClientId { get; set; }

    public string ServiceName { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public DateTime Date { get; set; }
    public string? Notes { get; set; }

    // Relacionamentos
    public User User { get; set; } = null!;
    public Client Client { get; set; } = null!;
}