import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import ApplicationLayout from '../components/ApplicationLayout';
import { FolderOpen, Upload, CheckCircle, AlertCircle, FileText, Image } from 'lucide-react';

const getDocumentLabel = (documentValue) => {
  if (!documentValue) return '';
  if (typeof documentValue === 'string') return documentValue;
  return documentValue.name || '';
};

const Documents = () => {
  const navigate = useNavigate();
  const { applicationData, updateApplicationData } = useAuth();
  const { t } = useLanguage();
  
  const [documents, setDocuments] = useState(applicationData.documents || {
    photo: null,
    signature: null,
    panCard: null,
    aadhaarFront: null,
    aadhaarBack: null,
    incomeCertificate: null,
    bankPassbook: null,
  });

  const [uploading, setUploading] = useState({});

  const documentTypes = [
    { key: 'photo', label: 'Passport Photo', required: true, icon: Image },
    { key: 'signature', label: 'Signature', required: true, icon: FileText },
    { key: 'panCard', label: 'PAN Card', required: true, icon: FileText },
    { key: 'aadhaarFront', label: 'Aadhaar Card (Front)', required: true, icon: Image },
    { key: 'aadhaarBack', label: 'Aadhaar Card (Back)', required: true, icon: Image },
    { key: 'incomeCertificate', label: 'Income Certificate', required: false, icon: FileText },
    { key: 'bankPassbook', label: 'Bank Passbook/Cancelled Cheque', required: true, icon: FileText },
  ];

  const handleFileChange = (key, file) => {
    if (file) {
      setUploading(prev => ({ ...prev, [key]: true }));
      const completeUpload = (value) => {
        setTimeout(() => {
          setDocuments(prev => ({ ...prev, [key]: value }));
          setUploading(prev => ({ ...prev, [key]: false }));
        }, 1000);
      };

      if (key === 'photo' && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          completeUpload({
            name: file.name,
            previewUrl: reader.result,
          });
        };
        reader.onerror = () => {
          completeUpload(file.name);
        };
        reader.readAsDataURL(file);
        return;
      }

      completeUpload(file.name);
    }
  };

  const handleSubmit = () => {
    const requiredDocs = documentTypes.filter(d => d.required);
    const missingDocs = requiredDocs.filter(d => !documents[d.key]);
    
    if (missingDocs.length > 0) {
      alert(t('Please upload all required documents'));
      return;
    }

    updateApplicationData({
      documents: {
        ...documents,
        uploadedAt: new Date().toISOString(),
      },
    });
    navigate('/application/9');
  };

  return (
    <ApplicationLayout stepNumber={8} title={t('Upload Documents')} onContinue={handleSubmit}>
      <div className="space-y-6">
        <div className="step-info-panel flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <p className="font-medium text-blue-800">{t('Document Requirements')}</p>
            <p className="text-sm text-blue-700">{t('Upload clear, legible copies of all required documents. Max file size: 5MB. Supported formats: JPG, PNG, PDF.')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {documentTypes.map((doc) => {
            const Icon = doc.icon;
            const isUploaded = documents[doc.key];
            const isUploading = uploading[doc.key];
            
            return (
              <div
                key={doc.key}
                className={`rounded-[1.6rem] border-2 p-5 transition-all ${
                  isUploaded ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white/5'
                }`}
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                      <Icon className="w-5 h-5 text-gray-400" />
                    </div>
                    <span className="font-medium text-gray-900">{t(doc.label)}</span>
                    {doc.required && <span className="text-red-500">*</span>}
                  </div>
                  {isUploaded && <CheckCircle className="w-5 h-5 text-green-600" />}
                </div>

                <label className="flex min-h-28 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-4 py-4 text-center transition-colors hover:bg-gray-50">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileChange(doc.key, e.target.files[0])}
                    className="hidden"
                    disabled={isUploading}
                  />
                  {isUploading ? (
                    <span className="text-gray-500">{t('Uploading...')}</span>
                  ) : isUploaded ? (
                    <>
                      <span className="text-green-600 text-sm font-semibold">{t('Uploaded successfully')}</span>
                      <span className="text-sm truncate text-gray-500">{getDocumentLabel(documents[doc.key])}</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-500">{t('Click to upload')}</span>
                      <span className="text-xs text-gray-400">{t('JPG, PNG, PDF up to 5MB')}</span>
                    </>
                  )}
                </label>
              </div>
            );
          })}
        </div>
      </div>
    </ApplicationLayout>
  );
};

export default Documents;
