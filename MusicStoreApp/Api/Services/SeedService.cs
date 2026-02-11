namespace MusicStoreApp.Api.Services
{
    public static class SeedService
    {
        public static int Combine(long seed, int page, int index)
        {
            unchecked
            {
                return (int)(seed * 397 ^ page * 31 ^ index);
            }
        }
    }
}
