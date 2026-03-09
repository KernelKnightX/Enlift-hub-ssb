import { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  Upload,
  FileJson,
  Trash2,
  Plus,
  Save,
  CheckCircle,
  AlertCircle,
  X,
  Image as ImageIcon
} from 'lucide-react';
import { savePPDTSet } from '@/lib/testDataService';
import { uploadPPDTImage } from '@/lib/firebaseStorage';
import type { TestImage } from '@/types/schema';

interface ImageEntry extends TestImage {
  file?: File;
  preview?: string;
}

export default function PPDTUploadPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<ImageEntry[]>([]);
  const [setId, setSetId] = useState('set1');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Predefined set options
  const setOptions = [
    { value: 'set1', label: 'Set 1' },
    { value: 'set2', label: 'Set 2' },
    { value: 'set3', label: 'Set 3' },
    { value: 'set4', label: 'Set 4' },
    { value: 'set5', label: 'Set 5' },
    { value: 'set6', label: 'Set 6' },
    { value: 'set7', label: 'Set 7' },
    { value: 'set8', label: 'Set 8' },
    { value: 'set9', label: 'Set 9' },
    { value: 'set10', label: 'Set 10' }
  ];

  // Handle multiple image file upload
  const handleMultipleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newImages: ImageEntry[] = Array.from(files).map((file, index) => ({
      id: `${images.length + index + 1}`,
      url: '',
      alt: file.name.replace(/\.[^/.]+$/, ''), // Use filename without extension as alt
      file,
      preview: URL.createObjectURL(file)
    }));

    setImages([...images, ...newImages]);
    setMessage({ type: 'success', text: `Added ${newImages.length} images` });
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string);
        const json = Array.isArray(parsed) ? parsed : [];
        const parsedImages: ImageEntry[] = json.map((item: unknown, index: number) => {
          const itemObj = item as { url?: string; alt?: string };
          return {
            id: `${index + 1}`,
            url: itemObj.url || '',
            alt: itemObj.alt || `PPDT Image ${index + 1}`
          };
        });
        
        setImages(parsedImages);
        setMessage({ type: 'success', text: `Loaded ${parsedImages.length} images from JSON` });
      } catch (error) {
        setMessage({ type: 'error', text: 'Invalid JSON format. Please check the file.' });
      }
    };
    reader.readAsText(file);
  };

  const handleImageFileChange = (id: string, file: File | null) => {
    if (!file) return;
    
    const preview = URL.createObjectURL(file);
    setImages(images.map(img => {
      if (img.id === id) {
        return { ...img, file, preview, url: '' };
      }
      return img;
    }));
  };

  const addImage = () => {
    const newImage: ImageEntry = {
      id: `${images.length + 1}`,
      url: '',
      alt: `PPDT Image ${images.length + 1}`
    };
    setImages([...images, newImage]);
  };

  const updateImage = (id: string, field: keyof ImageEntry, value: string) => {
    setImages(images.map(img => img.id === id ? { ...img, [field]: value } : img));
  };

  const removeImage = (id: string) => {
    setImages(images.filter(img => img.id !== id).map((img, index) => ({ ...img, id: `${index + 1}` })));
  };

  const handleSave = async () => {
    if (!setId) {
      setMessage({ type: 'error', text: 'Please select a set' });
      return;
    }
    if (images.length === 0) {
      setMessage({ type: 'error', text: 'Please add at least one image' });
      return;
    }

    setUploading(true);
    setMessage(null);

    try {
      // Upload images and get URLs
      const uploadedImages: TestImage[] = [];
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        if (img.file) {
          // Upload file to Firebase Storage
          const url = await uploadPPDTImage(img.file, setId, i + 1);
          uploadedImages.push({
            id: `${i + 1}`,
            url,
            alt: img.alt || `PPDT Image ${i + 1}`
          });
        } else {
          // Use existing URL
          uploadedImages.push({
            id: `${i + 1}`,
            url: img.url,
            alt: img.alt || `PPDT Image ${i + 1}`
          });
        }
      }

      await savePPDTSet(setId, uploadedImages);
      setMessage({ type: 'success', text: `Successfully saved ${uploadedImages.length} images to ${setId}` });
      setImages([]);
    } catch (error) {
      console.error('Error saving:', error);
      setMessage({ type: 'error', text: 'Failed to save. Please try again.' });
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    const template = [
      { url: 'https://example.com/ppdt1.jpg', alt: 'PPDT Image 1' },
      { url: 'https://example.com/ppdt2.jpg', alt: 'PPDT Image 2' }
    ];
    const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ppdt_template.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-muted/10">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-xl font-bold">Upload PPDT Images</h1>
              <p className="text-sm text-muted-foreground">Manage Picture Perception and Discussion Test images</p>
            </div>
          </div>
          <Badge variant="outline">Admin Mode</Badge>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Message */}
        {message && (
          <Card className={`mb-6 ${message.type === 'error' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}>
            <CardContent className="py-4 flex items-center gap-3">
              {message.type === 'error' ? (
                <AlertCircle className="w-5 h-5 text-red-500" />
              ) : (
                <CheckCircle className="w-5 h-5 text-green-500" />
              )}
              <span className={message.type === 'error' ? 'text-red-700' : 'text-green-700'}>
                {message.text}
              </span>
              <Button variant="ghost" size="sm" className="ml-auto" onClick={() => setMessage(null)}>
                <X className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Set Selection */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Select Set</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="setId">Set Number</Label>
                <select
                  id="setId"
                  value={setId}
                  onChange={(e) => setSetId(e.target.value)}
                  className="w-full p-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-background"
                >
                  {setOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground mt-1">Choose which set to upload images to</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Image Upload Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Upload Images
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* File Upload Area */}
            <div className="border-2 border-dashed border-blue-200 rounded-lg p-8 text-center bg-blue-50/50">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleMultipleImageUpload}
                className="hidden"
              />
              <Upload className="w-12 h-12 mx-auto text-blue-400 mb-4" />
              <p className="text-sm text-gray-700 mb-2 font-medium">Click to select multiple images</p>
              <p className="text-xs text-gray-500 mb-4">
                Select all images you want to upload for this set
              </p>
              <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                <Plus className="w-4 h-4 mr-2" />
                Select Images
              </Button>
            </div>

            <Separator />

            {/* JSON Upload */}
            <div>
              <p className="text-sm text-gray-600 mb-2">Or upload via JSON file:</p>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="json-upload"
                />
                <Button variant="outline" onClick={() => document.getElementById('json-upload')?.click()}>
                  <FileJson className="w-4 h-4 mr-2" />
                  Choose JSON File
                </Button>
                <Button variant="ghost" size="sm" onClick={downloadTemplate}>
                  Download Template
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Images List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Images ({images.length})</CardTitle>
              <Button variant="outline" size="sm" onClick={addImage}>
                <Plus className="w-4 h-4 mr-2" />Add Manually
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {images.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <ImageIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No images added yet. Upload images using the section above.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {images.map((img, index) => (
                  <div key={img.id} className="flex items-start gap-3 p-3 border rounded-lg">
                    <span className="text-sm text-gray-500 w-8 pt-2">{index + 1}.</span>
                    <div className="flex-1 space-y-2">
                      {/* Image Preview */}
                      {(img.preview || img.url) && (
                        <div className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
                          <img 
                            src={img.preview || img.url} 
                            alt={img.alt}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      )}
                      {/* File Upload */}
                      <div>
                        <Label htmlFor={`image-file-${img.id}`} className="text-xs">Change Image</Label>
                        <input
                          type="file"
                          id={`image-file-${img.id}`}
                          accept="image/*"
                          onChange={(e) => handleImageFileChange(img.id, e.target.files?.[0] || null)}
                          className="w-full text-sm"
                        />
                      </div>
                      {/* Alt Text */}
                      <Input
                        placeholder="Alt text (description)"
                        value={img.alt}
                        onChange={(e) => updateImage(img.id, 'alt', e.target.value)}
                      />
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removeImage(img.id)} className="text-red-500 mt-1">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <Button size="lg" onClick={handleSave} disabled={uploading || images.length === 0 || !setId}>
            <Save className="w-4 h-4 mr-2" />
            {uploading ? 'Saving...' : 'Save to Firebase'}
          </Button>
        </div>
      </div>
    </div>
  );
}
