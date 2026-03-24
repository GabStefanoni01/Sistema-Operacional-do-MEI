namespace MeiManager.Domain.Entities;

public class Budget : BaseEntity
{
    public int UserId { get; set; }
    public int ClientId { get; set; }

    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string Status { get; set; } = "pending";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Relacionamentos
    public User User { get; set; } = null!;
    public Client Client { get; set; } = null!;
}