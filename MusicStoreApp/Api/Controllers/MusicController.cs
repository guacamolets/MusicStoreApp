using Microsoft.AspNetCore.Mvc;
using MusicStoreApp.Api.Services;
using NAudio.SoundFont;

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

    [HttpGet("mp3")]
    public IActionResult GetMp3(int seed = 1, int trackIndex = 1)
    {
        var mp3 = _generator.GenerateMp3(seed, trackIndex);
        return File(mp3, "audio/mpeg", $"song_{seed}.mp3");
    }

    [HttpGet("midi")]
    public IActionResult GetMidi(int seed = 1)
    {
        var data = _generator.GenerateMidi(seed);
        return File(data, "audio/midi", $"song_{seed}.midi");
    }
}