import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
app.use(cors({
  origin: "http://localhost:5173", 
}));

app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Models
const MoodSchema = new mongoose.Schema({ name: String });
const Mood = mongoose.model("Mood", MoodSchema);

const RitualSchema = new mongoose.Schema({
  name: String,
  mood: String,
});
const Ritual = mongoose.model("Ritual", RitualSchema);

const RitualStepSchema = new mongoose.Schema({
  ritual: { type: mongoose.Schema.Types.ObjectId, ref: "Ritual" },
  instruction: String,
  quote: String,
});
const RitualStep = mongoose.model("RitualStep", RitualStepSchema);

const QuoteSchema = new mongoose.Schema({
  mood: String,
  text: String,
});
const Quote = mongoose.model("Quote", QuoteSchema);

const FavoriteSchema = new mongoose.Schema({
  user: String,
  ritual: { type: mongoose.Schema.Types.ObjectId, ref: "Ritual" },
});
const Favorite = mongoose.model("Favorite", FavoriteSchema);

// Routes
// Seed example data
app.get("/api/seed", async (req, res) => {
  await Mood.deleteMany({});
  await Ritual.deleteMany({});
  await RitualStep.deleteMany({});
  await Quote.deleteMany({});
  await Favorite.deleteMany({});

  const moods = ["calm", "happy", "tired", "stressed"];
  const moodDocs = await Mood.insertMany(moods.map((name) => ({ name })));

  const rituals = [
    { name: "Breathing Ritual", mood: "calm" },
    { name: "Mini Meditation", mood: "calm" },
    { name: "Gentle Stretch", mood: "calm" },
    { name: "Gratitude Moment", mood: "happy" },
    { name: "Joyful Pause", mood: "happy" },
    { name: "Share Kindness", mood: "happy" },
    { name: "Light Recenter", mood: "tired" },
    { name: "Body Reset", mood: "tired" },
    { name: "Calm Pause", mood: "tired" },
    { name: "Grounding Ritual", mood: "stressed" },
    { name: "Mind Declutter", mood: "stressed" },
    { name: "Slow Breathing", mood: "stressed" },
  ];

  const ritualDocs = await Ritual.insertMany(rituals);

 const steps = [
  {
    ritualName: "Breathing Ritual",
    steps: [
      { instruction: "Sit comfortably and close your eyes.", quote: "Stillness is a form of strength." },
      { instruction: "Take a deep slow breath in…", quote: "Each breath resets the soul." },
      { instruction: "Exhale gently and release tension.", quote: "Let go. Just a little." },
      { instruction: "Repeat for 5 cycles of deep breaths.", quote: "Repetition brings calm." },
    ],
  },
  {
    ritualName: "Mini Meditation",
    steps: [
      { instruction: "Close your eyes and focus on your breath.", quote: "Calm mind, clear thoughts." },
      { instruction: "Notice the tension in your body.", quote: "Awareness is the first step to release." },
      { instruction: "Breathe in deeply, then out slowly.", quote: "Each breath is a reset." },
      { instruction: "Visualize a peaceful place for a few moments.", quote: "Your mind deserves a sanctuary." },
    ],
  },
  {
    ritualName: "Gentle Stretch",
    steps: [
      { instruction: "Raise your arms overhead and stretch.", quote: "Reach for the sky, release your stress." },
      { instruction: "Roll your shoulders gently backwards.", quote: "Small motions have big effects." },
      { instruction: "Stretch side to side slowly.", quote: "Loosen tension with awareness." },
      { instruction: "Take a deep breath and relax.", quote: "Stretch, breathe, and let go." },
    ],
  },
  {
    ritualName: "Gratitude Moment",
    steps: [
      { instruction: "Think of something good from today.", quote: "Small joys carry surprising weight." },
      { instruction: "Say it softly to yourself.", quote: "Spoken gratitude doubles in strength." },
      { instruction: "Write it down in a notebook if you like.", quote: "Writing cements the feeling." },
      { instruction: "Hold that feeling for a breath.", quote: "Warmth grows when you let it." },
    ],
  },
  {
    ritualName: "Joyful Pause",
    steps: [
      { instruction: "Take a moment to smile genuinely.", quote: "Joy starts with a simple smile." },
      { instruction: "Recall a recent happy memory.", quote: "Happiness lives in your recollection." },
      { instruction: "Share a kind word with someone nearby.", quote: "Kindness spreads like sunlight." },
    ],
  },
  {
  ritualName: "Share Kindness",
  steps: [
    { instruction: "Think of someone who could use encouragement.", quote: "Kindness begins in awareness." },
    { instruction: "Send them a short, genuine message.", quote: "Small words can carry big warmth." },
    { instruction: "Notice how it feels to give.", quote: "Generosity rewards the giver." },
  ],
},
{
  ritualName: "Light Recenter",
  steps: [
    { instruction: "Sit upright and place your feet on the ground.", quote: "Stability restores energy." },
    { instruction: "Take three slow, steady breaths.", quote: "Slowness sharpens focus." },
    { instruction: "Gently roll your neck and shoulders.", quote: "Movement wakes the body." },
    { instruction: "Set a simple intention for the next task.", quote: "Clarity conserves energy." },
  ],
},
{
  ritualName: "Body Reset",
  steps: [
    { instruction: "Stand up and stretch your arms wide.", quote: "Your body remembers motion." },
    { instruction: "Shake out your hands and legs lightly.", quote: "Release creates renewal." },
    { instruction: "Breathe deeply while standing tall.", quote: "Posture influences energy." },
    { instruction: "Sit back down slowly.", quote: "Reset complete." },
  ],
},
{
  ritualName: "Calm Pause",
  steps: [
    { instruction: "Stop what you’re doing for a moment.", quote: "Stillness interrupts stress." },
    { instruction: "Place one hand on your chest.", quote: "Grounding starts within." },
    { instruction: "Inhale deeply through your nose.", quote: "Breath is your anchor." },
    { instruction: "Exhale longer than you inhaled.", quote: "Long exhales calm the nervous system." },
  ],
},
{
  ritualName: "Grounding Ritual",
  steps: [
    { instruction: "Name 3 things you can see.", quote: "Vision roots awareness." },
    { instruction: "Name 2 things you can hear.", quote: "Sound pulls you into the present." },
    { instruction: "Name 1 thing you can feel physically.", quote: "The body knows now." },
    { instruction: "Take one deep breath.", quote: "You are here." },
  ],
},
{
  ritualName: "Mind Declutter",
  steps: [
    { instruction: "Close your eyes briefly.", quote: "Noise fades in darkness." },
    { instruction: "Name one thought you’re holding.", quote: "Naming loosens grip." },
    { instruction: "Imagine placing it on a shelf.", quote: "Not everything needs attention now." },
    { instruction: "Breathe and reopen your eyes.", quote: "Mental space regained." },
  ],
},
{
  ritualName: "Slow Breathing",
  steps: [
    { instruction: "Inhale slowly for 4 seconds.", quote: "Control begins with breath." },
    { instruction: "Hold gently for 2 seconds.", quote: "Pause is power." },
    { instruction: "Exhale for 6 seconds.", quote: "Lengthened exhales calm the body." },
    { instruction: "Repeat 4 times.", quote: "Consistency creates calm." },
  ],
}
];


  for (let r of steps) {
    const ritual = ritualDocs.find((x) => x.name === r.ritualName);
    if (ritual) {
      await RitualStep.insertMany(
        r.steps.map((s) => ({ ritual: ritual._id, instruction: s.instruction, quote: s.quote }))
      );
    }
  }

  const quotes = [
    { mood: "calm", text: "Peace begins with a single breath." },
    { mood: "happy", text: "Happiness grows when shared." },
    { mood: "tired", text: "Rest is a form of self-respect." },
    { mood: "stressed", text: "Calm is a choice you can make now." },
  ];
  await Quote.insertMany(quotes);

  res.send("Seeded database with example data!");
});

// API Routes
// Get all moods
app.get("/api/mood", async (req, res) => {
  const moods = await Mood.find({});
  res.json(moods);
});

// Get all rituals (optionally filter by mood)
app.get("/api/ritual", async (req, res) => {
  const { mood } = req.query;
  const filter = mood ? { mood } : {};
  const rituals = await Ritual.find(filter);
  res.json(rituals);
});

// Get steps for a ritual
app.get("/api/ritualStep", async (req, res) => {
  const { ritual } = req.query;
  const steps = await RitualStep.find({ ritual });
  res.json(steps);
});

// Get quotes optionally filter by mood
app.get("/api/quotes", async (req, res) => {
  const { mood } = req.query;
  const filter = mood ? { mood } : {};
  const q = await Quote.find(filter);
  res.json(q);
});

// Favorites
app.get("/api/favorites/:user", async (req, res) => {
  const { user } = req.params;
  const favs = await Favorite.find({ user }).populate("ritual");
  res.json(favs);
});

app.post("/api/favorites", async (req, res) => {
  const { user, ritual } = req.body;
  const fav = new Favorite({ user, ritual });
  await fav.save();
  res.json(fav);
});

app.delete("/api/favorites/:id", async (req, res) => {
  await Favorite.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
