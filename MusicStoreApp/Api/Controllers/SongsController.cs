using Microsoft.AspNetCore.Mvc;
using MusicStoreApp.Api.Dto;
using MusicStoreApp.Api.Services;

namespace MusicStoreApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SongsController : ControllerBase
{
    private readonly SongGenerator _generator = new();

    [HttpGet]
    public SongsPageDto GetSongs(
        int page = 1,
        int pageSize = 20,
        long seed = 1,
        string lang = "en",
        double likes = 0
    )
    {
        var items = Enumerable.Range(0, pageSize)
            .Select(i => _generator.Generate(page - 1 + i, page, seed, lang, likes)).ToList();

        return new SongsPageDto(page, items);
    }
}
