namespace MusicStoreApp.Api.Dto;

public class SongsPageDto
{
    public IEnumerable<SongDto> Songs { get; set; } = new List<SongDto>();
    public int TotalPages { get; set; }
}
