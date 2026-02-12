namespace MusicStoreApp.Api.Dto;

public record SongDto(
    int Index,
    string Title,
    string Artist,
    string Album,
    string Genre,

    int Likes,

    string CoverUrl,

    string ReviewAuthor,
    string ReviewText
);
