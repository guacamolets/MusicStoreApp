using MusicStoreApp.Api.Dto;

namespace MusicStoreApp.Api.Dto;

public record SongsPageDto(
    int Page,
    IReadOnlyList<SongDto> Items
);
