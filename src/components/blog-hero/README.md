# Blog Hero

Hero component for blog posts.

## Props

- `post?: PostFragment | null` - Post fragment with model data
- `model?: PostModelBaseFragment | null` - Post model fragment (alternative to post prop)

## Usage

```tsx
<BlogHero post={post} />
// or
<BlogHero model={postModel} />
```

