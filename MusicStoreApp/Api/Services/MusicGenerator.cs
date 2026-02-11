using Melanchall.DryWetMidi.Common;
using Melanchall.DryWetMidi.Core;
using Melanchall.DryWetMidi.Interaction;

namespace MusicStoreApp.Api.Services
{
    public class MusicGenerator
    {
        public byte[] Generate(int seed, int durationSeconds = 10, int tempo = 120)
        {
            var rand = new Random(seed);

            var trackChunks = new List<TrackChunk>
            {
                new TrackChunk(), // Melody
                new TrackChunk()  // Bass
            };

            var melodyNotes = new List<Note>();
            var bassNotes = new List<Note>();

            int[] cMajor = { 60, 62, 64, 65, 67, 69, 71 };
            int[] cBass = { 36, 38, 40, 41, 43, 45, 47 };

            for (int i = 0; i < durationSeconds; i++)
            {
                int noteMelody = cMajor[rand.Next(cMajor.Length)];
                int noteBass = cBass[rand.Next(cBass.Length)];

                melodyNotes.Add(new Note((SevenBitNumber)noteMelody, new SevenBitNumber(100)));
                bassNotes.Add(new Note((SevenBitNumber)noteBass, new SevenBitNumber(100)));
            }

            AddNotesSequentially(trackChunks[0], melodyNotes, tempo);
            AddNotesSequentially(trackChunks[1], bassNotes, tempo);

            var midiFile = new MidiFile(trackChunks);
            using var ms = new MemoryStream();

            midiFile.Write(ms);
            return ms.ToArray();
        }

        private void AddNotesSequentially(TrackChunk track, List<Note> notes, int tempo)
        {
            track.Events.Add(new SetTempoEvent(60000000 / tempo));

            foreach (var n in notes)
            {
                track.Events.Add(new NoteOnEvent(n.NoteNumber, n.Velocity) { DeltaTime = 0 });
                track.Events.Add(new NoteOffEvent(n.NoteNumber, new SevenBitNumber(0)) { DeltaTime = 480 });
            }
        }
    }
}
