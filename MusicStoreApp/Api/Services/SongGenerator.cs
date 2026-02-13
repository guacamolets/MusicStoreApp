using Bogus;
using MusicStoreApp.Api.Dto;
using MusicStoreApp.Api.Localization;

namespace MusicStoreApp.Api.Services;

public class SongGenerator
{
    public IEnumerable<SongDto> Generate(
        int index, int page, int pageSize, long userSeed, string locale, double avgLikes
    )
    {
        var contentSeed = SeedService.Combine(userSeed, page, index);
        var contentRandom = new Random(contentSeed);
        var likesRandom = new Random((int)(userSeed + index));

        Randomizer.Seed = contentRandom;

        var normalizedLocale = locale.Split('-')[0];
        var faker = new Faker(normalizedLocale);

        for (int i = 0; i < pageSize; i++)
        {
            var album = contentRandom.Next(0, 4) == 0
                ? AlbumConfig.SingleByLocale.GetValueOrDefault(normalizedLocale, "Single")
                : faker.Commerce.ProductName();

            int baseLikes = (int)Math.Floor(avgLikes);
            bool extra = likesRandom.NextDouble() < (avgLikes - baseLikes);

            yield return new SongDto(
                Index: index + i,
                Title: CapitalizeTitle($"{faker.Hacker.Adjective()} {faker.Hacker.Noun()}"),
                Artist: faker.Name.FullName(),
                Album: CapitalizeTitle(album),
                Genre: faker.Music.Genre(),
                Likes: baseLikes + (extra ? 1 : 0),
                CoverUrl: $"https://picsum.photos/seed/{$"{userSeed}-{page}-{i}"}/300/300",
                ReviewAuthor: faker.Name.FullName(),
                ReviewText: faker.Lorem.Paragraph()
            );
        }
    }

    static string CapitalizeTitle(string text)
    {
        if (string.IsNullOrWhiteSpace(text))
            return string.Empty;

        var words = text.Split(' ', StringSplitOptions.RemoveEmptyEntries);

        words[0] = char.ToUpper(words[0][0]) + words[0].Substring(1).ToLower();
        for (int i = 1; i < words.Length; i++)
            words[i] = words[i].ToLower();

        return string.Join(' ', words);
    }
}
