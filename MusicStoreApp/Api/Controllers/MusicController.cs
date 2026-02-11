using Microsoft.AspNetCore.Mvc;
using MusicStoreApp.Api.Services;

namespace MusicStoreApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MusicController : ControllerBase
{
    private readonly MusicGenerator _generator;

    public MusicController(MusicGenerator generator)
    {
        _generator = generator;
    }

    [HttpGet("midi")]
    public IActionResult GetMidi(int seed = 1, int duration = 10)
    {
        var data = _generator.Generate(seed, duration);
        return File(data, "audio/midi", $"song_{seed}.midi");
    }
}