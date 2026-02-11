using Bogus;
using MusicStoreApp.Api.Dto;

namespace MusicStoreApp.Api.Services
{
    public class SongGenerator
    {
        public SongDto Generate(
            int index,
            int page,
            long userSeed,
            string locale,
            double avgLikes
        )
        {
            var contentSeed = SeedService.Combine(userSeed, page, index);
            var contentRandom = new Random(contentSeed);

            Randomizer.Seed = contentRandom;

            var faker = new Faker(locale);

            var title = faker.Hacker.Phrase();
            var artist = faker.Name.FullName();
            var genre = faker.Music.Genre();

            var album = contentRandom.Next(0, 4) == 0
                ? "Single"
                : faker.Company.CompanyName();

            var likesRandom = new Random((int)(userSeed + index));

            int baseLikes = (int)Math.Floor(avgLikes);
            bool extra = likesRandom.NextDouble() < (avgLikes - baseLikes);

            int likes = baseLikes + (extra ? 1 : 0);

            return new SongDto(
                Index: index,
                Title: title,
                Artist: artist,
                Album: album,
                Genre: genre,
                Likes: likes
            );
        }
    }
}
