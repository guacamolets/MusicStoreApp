using Melanchall.DryWetMidi.Common;
using Melanchall.DryWetMidi.Core;
using Melanchall.DryWetMidi.Interaction;
using NAudio.Lame;
using NAudio.Wave;
using MeltySynth;

namespace MusicStoreApp.Api.Services
{
    public class MusicGenerator
    {
        public byte[] GenerateMp3(int seed = 1)
        {
            const int sampleRate = 44100;

            byte[] midiBytes = GenerateMidi(seed);

            using var midiStream = new MemoryStream(midiBytes);
            var midiFile = new MeltySynth.MidiFile(midiStream);

            var soundFont = new SoundFont("wwwroot/soundfonts/general.sf2");
            var synthesizer = new Synthesizer(soundFont, sampleRate);
            var sequencer = new MidiFileSequencer(synthesizer);

            sequencer.Play(midiFile, false);

            int totalSamples = (int)(midiFile.Length.TotalSeconds * sampleRate);

            float[] left = new float[totalSamples];
            float[] right = new float[totalSamples];

            sequencer.Render(left, right);

            using var mp3Stream = new MemoryStream();
            var waveFormat = new WaveFormat(sampleRate, 16, 2);

            using (var writer = new LameMP3FileWriter(mp3Stream, waveFormat, 192))
            {
                for (int i = 0; i < totalSamples; i++)
                {
                    short l = (short)(left[i] * short.MaxValue);
                    short r = (short)(right[i] * short.MaxValue);

                    writer.WriteByte((byte)(l & 0xff));
                    writer.WriteByte((byte)((l >> 8) & 0xff));
                    writer.WriteByte((byte)(r & 0xff));
                    writer.WriteByte((byte)((r >> 8) & 0xff));
                }
            }

            return mp3Stream.ToArray();
        }

        public byte[] GenerateMidi(int seed)
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

            for (int i = 0; i < rand.Next(10, 60); i++)
            {
                int noteMelody = cMajor[rand.Next(cMajor.Length)];
                int noteBass = cBass[rand.Next(cBass.Length)];

                melodyNotes.Add(new Note((SevenBitNumber)noteMelody, new SevenBitNumber(100)));
                bassNotes.Add(new Note((SevenBitNumber)noteBass, new SevenBitNumber(100)));
            }

            int tempo = rand.Next(60, 120);
            AddNotesSequentially(trackChunks[0], melodyNotes, tempo);
            AddNotesSequentially(trackChunks[1], bassNotes, tempo);

            var midiFile = new Melanchall.DryWetMidi.Core.MidiFile(trackChunks);
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
