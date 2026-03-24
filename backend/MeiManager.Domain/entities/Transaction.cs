namespace MeiManager.Domain.Entities;

public class Transaction : BaseEntity
{
    public int UserId { get; set; }

    public string Type { get; set; } = string.Empty; // income | expense
    public decimal Amount { get; set; }
    public string? Description { get; set; }
    public DateTime Date { get; set; }

    // Relacionamentos
    public User User { get; set; } = null!;
}