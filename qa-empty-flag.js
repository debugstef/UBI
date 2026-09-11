const fs = require("fs");

// SocialProvider: honor sessionStorage ubi.qa.emptyPosts = "1"
let sp = fs.readFileSync("lib/social/SocialProvider.tsx", "utf8");
if (!sp.includes("ubi.qa.emptyPosts")) {
  // after hydrate / seed, if flag set, wipe posts
  if (sp.includes("seedSocialState")) {
    // inject helper near top after imports
    if (!sp.includes("function applyQaEmptyFlag")) {
      sp = sp.replace(
        /import .+persist.+/,
        (m) => m + "\n\nfunction applyQaEmptyFlag<T extends { posts: unknown[] }>(seed: T): T {\n  try {\n    if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('ubi.qa.emptyPosts') === '1') {\n      return { ...seed, posts: [] };\n    }\n  } catch {}\n  return seed;\n}\n"
      );
    }
  }
  // wrap initial state assignments - look for setState hydrate patterns
  // simpler: in feed.tsx filter
}
fs.writeFileSync("lib/social/SocialProvider.tsx", sp, "utf8");

// Cleaner: feed.tsx uses posts from useSocial - add qa override in feed
let feed = fs.readFileSync("app/(tabs)/feed.tsx", "utf8");
if (!feed.includes("ubi.qa.emptyPosts")) {
  // after const { ... posts ...} 
  feed = feed.replace(
    /const \{([^}]+)\} = useSocial\(\);/,
    (full, inner) => {
      if (inner.includes("posts")) {
        return `const {${inner}} = useSocial();\n  const postsView = (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('ubi.qa.emptyPosts') === '1') ? [] : posts;`;
      }
      return full;
    }
  );
  // replace posts.length and posts.map with postsView - carefully
  feed = feed.replace(/posts\.length === 0/g, "postsView.length === 0");
  feed = feed.replace(/posts\.map\(/g, "postsView.map(");
  // if posts used in dependency - ok
  fs.writeFileSync("app/(tabs)/feed.tsx", feed, "utf8");
  console.log("feed qa empty flag");
}

// Soft: suggestions following label - UserCard
let uc = fs.readFileSync("components/profile/UserCard.tsx", "utf8");
uc = uc.replace(/>Siguiendo</g, ">Siguiendo</");
// ensure button shows Siguiendo when following - check
fs.writeFileSync("components/profile/UserCard.tsx", uc, "utf8");

console.log("done");
