import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  Plus,
  Save,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle,
  AlertCircle,
  FileText
} from 'lucide-react';
import {
  getAllBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  getAllCategories,
  generateSlug
} from '@/lib/blogService';
import { DEFAULT_CATEGORIES } from '@/lib/blogService';
import type { Blog, BlogCategory } from '@/types/schema';

export default function AdminBlogPage() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverImage: '',
    author: '',
    category: '',
    tags: '',
    isPublished: false
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [blogsData, catsData] = await Promise.all([
        getAllBlogs(),
        getAllCategories()
      ]);
      setBlogs(blogsData);
      
      // If no categories exist, use defaults
      if (catsData.length === 0) {
        setCategories(DEFAULT_CATEGORIES.map((c, i) => ({ ...c, id: `cat-${i}` })));
      } else {
        setCategories(catsData);
      }
    } catch (error) {
      console.error('Error loading blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content) {
      setMessage({ type: 'error', text: 'Title and content are required' });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const blogData = {
        title: formData.title,
        slug: formData.slug || generateSlug(formData.title),
        excerpt: formData.excerpt,
        content: formData.content,
        coverImage: formData.coverImage,
        author: formData.author || 'Enlift Team',
        category: formData.category || 'SSB Preparation',
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        isPublished: formData.isPublished
      };

      if (editingId) {
        await updateBlog(editingId, blogData);
        setMessage({ type: 'success', text: 'Blog updated successfully!' });
      } else {
        await createBlog(blogData);
        setMessage({ type: 'success', text: 'Blog created successfully!' });
      }

      // Reset form
      setFormData({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        coverImage: '',
        author: '',
        category: '',
        tags: '',
        isPublished: false
      });
      setShowForm(false);
      setEditingId(null);
      
      // Reload blogs
      loadData();
    } catch (error) {
      console.error('Error saving blog:', error);
      setMessage({ type: 'error', text: 'Failed to save blog. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (blog: Blog) => {
    setFormData({
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      content: blog.content,
      coverImage: blog.coverImage || '',
      author: blog.author,
      category: blog.category,
      tags: blog.tags.join(', '),
      isPublished: blog.isPublished
    });
    setEditingId(blog.id);
    setShowForm(true);
    setMessage(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog?')) return;

    try {
      await deleteBlog(id);
      setMessage({ type: 'success', text: 'Blog deleted successfully!' });
      loadData();
    } catch (error) {
      console.error('Error deleting blog:', error);
      setMessage({ type: 'error', text: 'Failed to delete blog.' });
    }
  };

  const handleTogglePublish = async (blog: Blog) => {
    try {
      await updateBlog(blog.id, { isPublished: !blog.isPublished });
      setMessage({ type: 'success', text: `Blog ${blog.isPublished ? 'unpublished' : 'published'}!` });
      loadData();
    } catch (error) {
      console.error('Error toggling blog:', error);
      setMessage({ type: 'error', text: 'Failed to update blog status.' });
    }
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      coverImage: '',
      author: '',
      category: '',
      tags: '',
      isPublished: false
    });
    setMessage(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <h1 className="text-xl font-semibold">Blog Management</h1>
          </div>
          <Button onClick={() => { setShowForm(true); setEditingId(null); setMessage(null); }}>
            <Plus className="h-4 w-4 mr-2" />
            New Blog Post
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
            message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            {message.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            {message.text}
          </div>
        )}

        {/* Blog Form */}
        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{editingId ? 'Edit Blog Post' : 'Create New Blog Post'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="Enter blog title"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="blog-url-slug"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    placeholder="Short description for blog cards..."
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content * (HTML supported)</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder={"Write your blog content here... HTML tags like h2, p, ul, li, blockquote are supported."}
                    rows={12}
                    className="font-mono text-sm"
                    required
                  />
                  <p className="text-xs text-gray-500">
                    Tip: Use HTML tags for formatting your content.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="coverImage">Cover Image URL</Label>
                    <Input
                      id="coverImage"
                      value={formData.coverImage}
                      onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="author">Author</Label>
                    <Input
                      id="author"
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      placeholder="Enlift Team"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                    >
                      <option value="">Select category</option>
                      {categories.map((cat) => (
                        <option key={cat.slug} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags (comma separated)</Label>
                    <Input
                      id="tags"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      placeholder="ssb, preparation, interview"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isPublished"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="isPublished" className="font-normal">
                    Publish immediately
                  </Label>
                </div>

                <div className="flex gap-4">
                  <Button type="submit" disabled={saving}>
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        {editingId ? 'Update Blog' : 'Create Blog'}
                      </>
                    )}
                  </Button>
                  <Button type="button" variant="outline" onClick={cancelForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Blog List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              All Blog Posts ({blogs.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : blogs.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No blog posts yet. Create your first one!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {blogs.map((blog) => (
                  <div
                    key={blog.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-medium truncate">{blog.title}</h3>
                        <Badge variant={blog.isPublished ? 'default' : 'secondary'}>
                          {blog.isPublished ? 'Published' : 'Draft'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{blog.category}</span>
                        <span>-</span>
                        <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                        {blog.publishedAt && (
                          <>
                            <span>-</span>
                            <span>Published: {new Date(blog.publishedAt).toLocaleDateString()}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(`/blog/${blog.slug}`, '_blank')}
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleTogglePublish(blog)}
                        title={blog.isPublished ? 'Unpublish' : 'Publish'}
                      >
                        {blog.isPublished ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(blog)}
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(blog.id)}
                        title="Delete"
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
