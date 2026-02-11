using Bogus;
using MusicStoreApp.Api.Dto;
using MusicStoreApp.Api.Localization;

namespace MusicStoreApp.Api.Services
{
    public class SongGenerator
    {
        public IEnumerable<SongDto> Generate(
            int index,
            int page,
            int pageSize,
            long userSeed,
            string locale,
            double avgLikes
        )
        {
            var contentSeed = SeedService.Combine(userSeed, page, index);
            var contentRandom = new Random(contentSeed);

            Randomizer.Seed = contentRandom;

            var normalizedLocale = locale.Split('-')[0];
            var faker = new Faker(normalizedLocale);

            var album = contentRandom.Next(0, 4) == 0
                ? AlbumConfig.SingleByLocale.GetValueOrDefault(normalizedLocale, "Single")
                : faker.Company.CompanyName();

            var likesRandom = new Random((int)(userSeed + index));

            int baseLikes = (int)Math.Floor(avgLikes);
            bool extra = likesRandom.NextDouble() < (avgLikes - baseLikes);

            int likes = baseLikes + (extra ? 1 : 0);

            for (int i = 0; i < pageSize; i++)
            {
                yield return new SongDto(
                    Index: index + i,
                    Title: faker.Hacker.Phrase(),
                    Artist: faker.Name.FullName(),
                    Genre: faker.Music.Genre(),
                    Album: album,
                    Likes: likes,
                    CoverUrl: $"https://picsum.photos/seed/{$"{userSeed}-{page}-{i}"}/300/300"
                );
            }
        }
    }
}
