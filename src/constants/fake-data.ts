import type { PostType } from "@/constants/types";

// Generate a random date within the last 30 days
const getRandomDate = () => {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const randomTime =
    thirtyDaysAgo.getTime() +
    Math.random() * (now.getTime() - thirtyDaysAgo.getTime());
  return new Date(randomTime);
};

// Generate a random number of likes (0-100)
const getRandomLikes = () => Math.floor(Math.random() * 100);

// Generate a random number of comments (0-20)
const getRandomComments = () => Math.floor(Math.random() * 20);

// Specialties for doctors
const specialties = [
  "Cardiology",
  "Neurology",
  "Pediatrics",
  "Orthopedics",
  "Dermatology",
  "Oncology",
  "Psychiatry",
  "Radiology",
  "Emergency Medicine",
  "Family Medicine",
];

// Sample post content
const postContents = [
  "Just finished a fascinating case study on early detection of cardiovascular disease using new biomarkers. The results are promising and could lead to earlier interventions. Would love to hear thoughts from other cardiologists who have been exploring similar approaches.",
  "Question for the community: What protocols are you following for post-operative pain management in pediatric patients? We're revising our guidelines and I'd appreciate input from colleagues with recent experience in this area.",
  "Attended an excellent workshop on advances in minimally invasive surgical techniques last week. The innovations in laparoscopic procedures are remarkable. Happy to share resources with interested colleagues.",
  "Has anyone implemented the new electronic health record system? We're considering the transition and I'd appreciate hearing about your experience, particularly regarding the learning curve for staff and any unexpected challenges.",
  "Seeking recommendations for patient education resources on diabetes management. Specifically looking for materials that are accessible for patients with limited health literacy.",
  "Interesting research published in NEJM this month on the correlation between sleep patterns and cognitive function. The longitudinal data presents compelling evidence for sleep hygiene as a preventative measure.",
  "We've been seeing an unusual increase in respiratory infections in our practice. Anyone else noticing similar patterns in their region? Curious if this is a localized phenomenon or more widespread.",
  "Just published my research on the efficacy of combination therapy for treatment-resistant depression. The data suggests promising outcomes for patients who haven't responded to traditional approaches.",
  "Looking for collaborators on a research project examining the relationship between gut microbiome and autoimmune disorders. Please message me if you're interested in contributing.",
  "What continuing education resources have you found most valuable recently? I'm particularly interested in online platforms that offer specialized courses in emergency medicine.",
  "We've implemented a new patient follow-up protocol that has significantly improved medication adherence rates. Happy to share our approach if anyone is interested.",
  "Seeking advice on managing physician burnout in high-volume practices. What strategies have been effective in your experience for maintaining well-being while meeting demanding patient loads?",
  "Fascinating case yesterday: patient presented with atypical symptoms that initially suggested one diagnosis, but further investigation revealed something entirely unexpected. Reminder of the importance of thorough differential diagnosis.",
  "Has anyone used the new point-of-care ultrasound device for vascular access? Considering purchasing for our department and would appreciate feedback on its accuracy and ease of use.",
  "Just completed a quality improvement project that reduced wait times in our clinic by 35%. The key was restructuring our scheduling system and patient flow. Happy to discuss specifics with interested colleagues.",
];

// Generate 20 fake posts
export const fakePosts: PostType[] = Array.from({ length: 20 }, (_, i) => {
  const createdAt = getRandomDate();
  const updatedAt = new Date(createdAt.getTime() + Math.random() * 86400000); // Add up to 24 hours

  return {
    id: `post-${i + 1}`,
    authorId: `author-${i + 1}`,
    authorName: `Dr. ${
      [
        "Smith",
        "Johnson",
        "Williams",
        "Brown",
        "Jones",
        "Garcia",
        "Miller",
        "Davis",
        "Rodriguez",
        "Martinez",
      ][i % 10]
    } ${["A.", "B.", "C.", "D.", "E.", "F.", "G.", "H.", "I.", "J."][i % 10]}`,
    authorAvatar: `/placeholder.svg?height=40&width=40`,
    authorSpecialty: specialties[i % specialties.length],
    content: postContents[i % postContents.length],
    createdAt,
    updatedAt,
    status: i < 15 ? "approved" : i < 18 ? "pending" : "rejected",
    likes: getRandomLikes(),
    likedByUser: Math.random() > 0.7,
    savedByUser: Math.random() > 0.8,
    comments: getRandomComments(),
  };
});

// Current user's posts (including pending ones)
export const currentUserPosts: PostType[] = [
  {
    id: "my-post-1",
    authorId: "current-user",
    authorName: "Dr. You",
    authorAvatar: `/placeholder.svg?height=40&width=40`,
    authorSpecialty: "Your Specialty",
    content:
      "I've been implementing a new approach to patient education in my practice, focusing on visual aids and simplified explanations. The patient feedback has been overwhelmingly positive, with reported improvements in medication adherence and follow-through on care plans.",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    status: "approved",
    likes: 42,
    likedByUser: false,
    savedByUser: true,
    comments: 7,
  },
  {
    id: "my-post-2",
    authorId: "current-user",
    authorName: "Dr. You",
    authorAvatar: `/placeholder.svg?height=40&width=40`,
    authorSpecialty: "Your Specialty",
    content:
      "Question for colleagues: What strategies have you found effective for managing patient anxiety before procedures? I'm looking to improve our pre-procedure protocols and would appreciate insights from different specialties.",
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    status: "pending",
    likes: 0,
    likedByUser: false,
    savedByUser: false,
    comments: 0,
  },
];

// Function to get all posts (approved ones from fake posts + all current user's posts)
export const getAllPosts = () => {
  const approvedFakePosts = fakePosts.filter(
    (post) => post.status === "approved"
  );
  return [...approvedFakePosts, ...currentUserPosts].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );
};

// Function to get only the current user's posts
export const getCurrentUserPosts = () => {
  return [...currentUserPosts].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );
};

// Function to get saved posts
export const getSavedPosts = () => {
  const savedFakePosts = fakePosts.filter((post) => post.savedByUser);
  const savedUserPosts = currentUserPosts.filter((post) => post.savedByUser);
  return [...savedFakePosts, ...savedUserPosts].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );
};

// Function to toggle like on a post
export const toggleLike = (postId: string) => {
  // In a real app, this would make an API call
  console.log(`Toggled like for post ${postId}`);
};

// Function to toggle save on a post
export const toggleSave = (postId: string) => {
  // In a real app, this would make an API call
  console.log(`Toggled save for post ${postId}`);
};

// Function to create a new post
export const createPost = (content: string) => {
  // In a real app, this would make an API call
  console.log(`Created new post: ${content}`);

  // Return a mock new post
  const newPost: PostType = {
    id: `new-post-${Date.now()}`,
    authorId: "current-user",
    authorName: "Dr. You",
    authorAvatar: `/placeholder.svg?height=40&width=40`,
    authorSpecialty: "Your Specialty",
    content,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "pending",
    likes: 0,
    likedByUser: false,
    savedByUser: false,
    comments: 0,
  };

  return newPost;
};
