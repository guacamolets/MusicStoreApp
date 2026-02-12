using Microsoft.AspNetCore.Mvc;
using MusicStoreApp.Api.Dto;
using MusicStoreApp.Api.Services;

namespace MusicStoreApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SongsController : ControllerBase
{
    private readonly SongGenerator _generator;

    public SongsController(SongGenerator generator)
    {
        _generator = generator;
    }

    [HttpGet]
    public IActionResult GetSongs(
        int page = 1,
        int pageSize = 20,
        long seed = 1,
        string lang = "en",
        double likes = 0
    )
    {
        var songs = _generator.Generate((page - 1) * pageSize + 1, page, pageSize, seed, lang, likes);

        return Ok(new SongsPageDto { Songs = songs, TotalPages = pageSize });
    }
}
