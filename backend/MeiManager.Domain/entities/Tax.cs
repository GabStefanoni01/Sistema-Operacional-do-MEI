namespace MeiManager.Domain.Entities;

public class Tax : BaseEntity
{
    public int UserId { get; set; }

    public int Month { get; set; }
    public int Year { get; set; }
    public decimal? Amount { get; set; }

    public string Status { get; set; } = "pending";
    public DateTime? DueDate { get; set; }

    // Relacionamentos
    public User User { get; set; } = null!;
}