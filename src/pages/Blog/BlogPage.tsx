import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router';
import { NavbarSection } from '@/pages/navbar/NavbarSection';
import { FooterSection } from '@/pages/navbar/FooterSection';
import { getPublishedBlogs, getBlogBySlug, getAllCategories } from '@/lib/blogService';
import type { Blog, BlogCategory } from '@/types/schema';
import { ArrowLeft, Calendar, User, Tag, ArrowRight, Loader2 } from 'lucide-react';

const css = `
  .bp { min-height: 100vh; background: #fafaf8; color: #1a1a1a; font-family: Georgia, serif; }
  .bp > * { box-sizing: border-box; }

  .bp-back { padding: 24px 48px 0; }
  .bp-back-btn { background: none; border: none; cursor: pointer; font-size: 14px; color: #666; letter-spacing: 0.05em; font-family: system-ui, sans-serif; display: flex; align-items: center; gap: 6px; }
  .bp-back-btn:hover { color: #1a1a1a; }

  /* HERO */
  .bp-hero { padding: 56px 48px 0; }
  .bp-eyebrow { font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: #888; font-family: system-ui; margin-bottom: 20px; }
  .bp-h1 { font-size: clamp(1.8rem, 3.5vw, 3.2rem); font-weight: 400; line-height: 1.1; letter-spacing: -0.02em; margin-bottom: 28px; max-width: 100%; }
  .bp-lead { font-size: 1.1rem; line-height: 1.85; color: #444; max-width: 100%; margin-bottom: 56px; font-style: italic; }

  /* NAV ANCHORS */
  .bp-anav { display: flex; gap: 0; border-top: 1px solid #e0ddd8; border-bottom: 1px solid #e0ddd8; margin-bottom: 0; overflow-x: auto; }
  .bp-anav a { font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; font-family: system-ui; color: #666; text-decoration: none; padding: 14px 20px; border-right: 1px solid #e0ddd8; white-space: nowrap; flex-shrink: 0; }
  .bp-anav a:hover { color: #1a1a1a; background: #f5f3f0; }
  .bp-anav a.active { color: #1a1a1a; background: #f5f3f0; font-weight: 600; }

  /* MAIN */
  .bp-main { padding: 0 48px; max-width: 1400px; margin: 0 auto; }

  /* BLOG GRID */
  .bp-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 32px; padding: 72px 0 64px; }
  .bp-card { background: #fff; border: 1px solid #e8e6e1; overflow: hidden; cursor: pointer; transition: all 0.3s ease; }
  .bp-card:hover { border-color: #ccc; transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.08); }
  .bp-card-img { width: 100%; height: 200px; object-fit: cover; background: #f0ede8; }
  .bp-card-body { padding: 28px; }
  .bp-card-cat { font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: #888; font-family: system-ui; margin-bottom: 10px; }
  .bp-card-title { font-size: 1.25rem; font-weight: 500; line-height: 1.4; margin-bottom: 12px; font-family: Georgia, serif; }
  .bp-card-excerpt { font-size: 0.95rem; line-height: 1.7; color: #555; margin-bottom: 16px; }
  .bp-card-meta { display: flex; align-items: center; gap: 16px; font-size: 12px; color: #888; font-family: system-ui; }
  .bp-card-meta span { display: flex; align-items: center; gap: 4px; }

  /* SINGLE BLOG POST */
  .bp-single { max-width: 100%; margin: 0 auto; padding: 48px 0 80px; }
  .bp-single-header { margin-bottom: 40px; }
  .bp-single-cat { font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: #888; font-family: system-ui; margin-bottom: 16px; }
  .bp-single-title { font-size: clamp(1.8rem, 3vw, 2.8rem); font-weight: 400; line-height: 1.2; margin-bottom: 24px; font-family: Georgia, serif; }
  .bp-single-meta { display: flex; align-items: center; gap: 24px; font-size: 13px; color: #666; font-family: system-ui; }
  .bp-single-meta span { display: flex; align-items: center; gap: 6px; }
  .bp-single-img { width: 100%; height: 400px; object-fit: cover; border-radius: 4px; margin-bottom: 40px; background: #f0ede8; }
  .bp-single-content { font-size: 1.1rem; line-height: 1.9; color: #333; }
  .bp-single-content p { margin-bottom: 24px; }
  .bp-single-content h2 { font-size: 1.6rem; font-weight: 400; margin: 48px 0 20px; font-family: Georgia, serif; }
  .bp-single-content h3 { font-size: 1.3rem; font-weight: 600; margin: 36px 0 16px; font-family: system-ui; }
  .bp-single-content ul, .bp-single-content ol { margin: 20px 0; padding-left: 24px; }
  .bp-single-content li { margin-bottom: 10px; }
  .bp-single-content blockquote { border-left: 3px solid #1a1a1a; padding-left: 20px; margin: 32px 0; font-style: italic; color: #555; }
  .bp-single-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 48px; padding-top: 24px; border-top: 1px solid #e8e6e1; }
  .bp-tag { font-size: 12px; padding: 6px 12px; background: #f0ede8; color: #555; border-radius: 2px; font-family: system-ui; }

  /* EMPTY STATE */
  .bp-empty { text-align: center; padding: 80px 20px; }
  .bp-empty-h2 { font-size: 1.5rem; font-weight: 400; margin-bottom: 12px; font-family: Georgia, serif; }
  .bp-empty-p { font-size: 1rem; color: #666; }

  /* LOADING */
  .bp-loading { display: flex; justify-content: center; align-items: center; min-height: 400px; }
  .bp-loading-spinner { color: #1a1a1a; }

  /* CATEGORIES FILTER */
  .bp-cats { display: flex; gap: 12px; padding: 24px 0; flex-wrap: wrap; }
  .bp-cat-btn { font-size: 13px; padding: 8px 16px; border: 1px solid #e0ddd8; background: #fff; cursor: pointer; font-family: system-ui; transition: all 0.2s; }
  .bp-cat-btn:hover { border-color: #1a1a1a; }
  .bp-cat-btn.active { background: #1a1a1a; color: #fff; border-color: #1a1a1a; }

  /* BACK LINK */
  .bp-back-post { display: inline-flex; align-items: center; gap: 8px; color: #666; text-decoration: none; font-size: 14px; margin-bottom: 32px; font-family: system-ui; }
  .bp-back-post:hover { color: #1a1a1a; }

  /* RELATED */
  .bp-related { margin-top: 80px; padding-top: 48px; border-top: 1px solid #e8e6e1; }
  .bp-related-h2 { font-size: 1.5rem; font-weight: 400; margin-bottom: 32px; font-family: Georgia, serif; }

  /* FOOTER SPACING */
  .bp-footer { margin-top: 0; }

  @media (max-width: 1050px) {
    .bp-grid { grid-template-columns: 1fr; }
  }

  @media (max-width: 860px) {
    .bp-back { padding: 20px 24px 0; }
    .bp-hero { padding: 40px 24px 0; }
    .bp-main { padding: 0 24px; }
    .bp-single-img { height: 250px; }
  }

  @media (max-width: 580px) {
    .bp-back { padding: 16px 16px 0; }
    .bp-hero { padding: 28px 16px 0; }
    .bp-main { padding: 0 16px; }
    .bp-h1 { font-size: 1.5rem; }
    .bp-lead { font-size: 0.95rem; }
    .bp-single-title { font-size: 1.5rem; }
    .bp-card-body { padding: 20px; }
  }
`;

function formatDate(dateString?: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function stripHtml(html: string): string {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

function truncateText(text: string, maxLength: number): string {
  const stripped = stripHtml(text);
  if (stripped.length <= maxLength) return stripped;
  return stripped.slice(0, maxLength).trim() + '...';
}

export default function BlogPage() {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug?: string }>();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [currentBlog, setCurrentBlog] = useState<Blog | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (slug) {
      loadBlog(slug);
    }
  }, [slug]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [blogsData, catsData] = await Promise.all([
        getPublishedBlogs(),
        getAllCategories()
      ]);
      setBlogs(blogsData);
      setCategories(catsData);
    } catch (error) {
      console.error('Error loading blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadBlog = async (blogSlug: string) => {
    try {
      setLoading(true);
      const blog = await getBlogBySlug(blogSlug);
      setCurrentBlog(blog);
    } catch (error) {
      console.error('Error loading blog:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBlogs = selectedCategory === 'all' 
    ? blogs 
    : blogs.filter(b => b.category.toLowerCase() === selectedCategory.toLowerCase());

  // Show single blog post
  if (slug && currentBlog) {
    return (
      <>
        <NavbarSection />
        <div className="bp">
          <style>{css}</style>
          
          <div className="bp-back pt-16">
            <button className="bp-back-btn" onClick={() => navigate('/blog')}>
              <ArrowLeft size={16} /> Back to Blogs
            </button>
          </div>

          <main className="bp-main">
            <article className="bp-single">
              <header className="bp-single-header">
                <div className="bp-single-cat">{currentBlog.category}</div>
                <h1 className="bp-single-title">{currentBlog.title}</h1>
                <div className="bp-single-meta">
                  <span><User size={14} /> {currentBlog.author}</span>
                  <span><Calendar size={14} /> {formatDate(currentBlog.publishedAt || currentBlog.createdAt)}</span>
                </div>
              </header>

              {currentBlog.coverImage && (
                <img src={currentBlog.coverImage} alt={currentBlog.title} className="bp-single-img" />
              )}

              <div 
                className="bp-single-content"
                dangerouslySetInnerHTML={{ __html: currentBlog.content }}
              />

              {currentBlog.tags && currentBlog.tags.length > 0 && (
                <div className="bp-single-tags">
                  {currentBlog.tags.map((tag, i) => (
                    <span key={i} className="bp-tag">{tag}</span>
                  ))}
                </div>
              )}
            </article>
          </main>
        </div>
        <FooterSection />
      </>
    );
  }

  // Show blog listing
  return (
    <>
      <NavbarSection />
      <div className="bp">
        <style>{css}</style>

        <div className="bp-back pt-16">
          <button className="bp-back-btn" onClick={() => navigate('/')}>← Back to Home</button>
        </div>

        {/* HERO */}
        <header className="bp-hero">
          <div className="bp-eyebrow">Enlift hub Blog</div>
          <h1 className="bp-h1">Stories, Strategies & Success</h1>
          <p className="bp-lead">
            Real experiences, expert guidance and proven strategies to help you crack the SSB selection process.
          </p>
          {/* Anchor nav */}
          <nav className="bp-anav">
            <a 
              href="#" 
              className={selectedCategory === 'all' ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); setSelectedCategory('all'); }}
            >
              All Posts
            </a>
            {categories.map((cat) => (
              <a 
                key={cat.id}
                href="#"
                className={selectedCategory === cat.slug ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); setSelectedCategory(cat.slug); }}
              >
                {cat.name}
              </a>
            ))}
          </nav>
        </header>

        <main className="bp-main">
          {loading ? (
            <div className="bp-loading">
              <Loader2 className="bp-loading-spinner animate-spin" size={32} />
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="bp-empty">
              <h2 className="bp-empty-h2">No blogs yet</h2>
              <p className="bp-empty-p">Check back soon for new content!</p>
            </div>
          ) : (
            <div className="bp-grid">
              {filteredBlogs.map((blog) => (
                <div 
                  key={blog.id} 
                  className="bp-card"
                  onClick={() => navigate(`/blog/${blog.slug}`)}
                >
                  {blog.coverImage && (
                    <img src={blog.coverImage} alt={blog.title} className="bp-card-img" />
                  )}
                  <div className="bp-card-body">
                    <div className="bp-card-cat">{blog.category}</div>
                    <h3 className="bp-card-title">{blog.title}</h3>
                    <p className="bp-card-excerpt">{truncateText(blog.excerpt || blog.content, 150)}</p>
                    <div className="bp-card-meta">
                      <span><User size={12} /> {blog.author}</span>
                      <span><Calendar size={12} /> {formatDate(blog.publishedAt || blog.createdAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
      <FooterSection />
    </>
  );
}
