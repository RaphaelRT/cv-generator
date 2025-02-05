'use client';

import { useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { setFile, clearFile } from '@/store/slices/fileSlice';
import { validateFile } from '@/utils/validateFile';
import { SelectNative } from "@/components/ui/select-native";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function Home() {
  const file = useSelector((state: RootState) => state.file?.file || null);
  const dispatch = useDispatch<AppDispatch>();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    link: '',
    gender: 'homme',
    offerContent: '',
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<{ pdfLink?: string; error?: string; data?: { offer: Offer } } | null>(null);

  const updateField = (field: string, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (!uploadedFile) return;

    const validationError = validateFile(uploadedFile);
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    dispatch(setFile(uploadedFile));
    setErrorMessage(null);
  };

  const handleRemoveFile = () => {
    dispatch(clearFile());
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async () => {
    const { link, gender, offerContent } = formData;

    if (!link || !file || !offerContent) {
      setErrorMessage('Veuillez remplir tous les champs, télécharger un fichier JSON et fournir le contenu de l’offre.');
      return;
    }

    setIsLoading(true);
    setResponse(null);

    const data = new FormData();
    data.append('link', link);
    data.append('file', file);
    data.append('gender', gender);
    data.append('offerContent', offerContent);

    try {
      const res = await fetch('/api/process', { method: 'POST', body: data });
      const result = await res.json();

      if (!res.ok) throw new Error('Erreur lors de la requête API');
      setResponse(result.externalResponse);
    } catch (error) {
      setResponse({ error: 'Une erreur est survenue lors du traitement de votre demande.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-col lg:flex-row p-8 w-full h-[80vh]">
      <FormSection
        formData={formData}
        file={file}
        isLoading={isLoading}
        errorMessage={errorMessage}
        fileInputRef={fileInputRef}
        onFileUpload={handleFileUpload}
        onFileRemove={handleRemoveFile}
        onFieldChange={updateField}
        onSubmit={handleSubmit}
      />
      <ResponseSection response={response} isLoading={isLoading} />
    </main>
  );
}

function FormSection({
  formData,
  file,
  isLoading,
  errorMessage,
  fileInputRef,
  onFileUpload,
  onFileRemove,
  onFieldChange,
  onSubmit,
}: {
  formData: { link: string; gender: string; offerContent: string };
  file: File | null;
  isLoading: boolean;
  errorMessage: string | null;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFileRemove: () => void;
  onFieldChange: (field: string, value: string) => void;
  onSubmit: () => void;
}) {
  return (
    <div className="flex flex-col w-full lg:w-1/2 h-full justify-center">
      <form className="bg-white rounded-md px-8 pt-6 pb-8 border-blue-800 border-2 h-full justify-center  flex flex-col">
        <FormField label="Genre">
          <SelectNative
            id="gender"
            value={formData.gender}
            onChange={(e:any) => onFieldChange('gender', e.target.value)}>
            <option value="homme">Homme</option>
            <option value="femme">Femme</option>
            <option value="autre">Autre</option>
          </SelectNative>
        </FormField>
        <FormField label="Lien de l’annonce">
          <Input
            id="link"
            placeholder="https://offres-incroyables.com/annonces/...."
            type="text"
            value={formData.link}
            onChange={(e) => onFieldChange('link', e.target.value)}/>
        </FormField>
        <FormField label="CV de référence (JSON)">
          {file ? (
            <div>
              <p className="text-black text-sm">Fichier : {file.name}</p>
              <button type="button" className="text-red-500 text-sm underline" onClick={onFileRemove}>
                Supprimer le fichier
              </button>
            </div>
          ) : (
            <Input
              id="jsonFile"
              accept=".json"
              onChange={onFileUpload}
              ref={fileInputRef}
              className="p-0 pe-3 file:me-3 file:border-0 file:border-e"
              type="file" />
          )}
        </FormField>
        {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}
        <FormField label="Contenu de l’offre">
          <Textarea
            id="offerContent"
            placeholder="Contenu html de la page ctrl+A ctrl+C ctrl+V"
            value={formData.offerContent}
            onChange={(e) => onFieldChange('offerContent', e.target.value)}
            />
        </FormField>
        <Button
          variant="outline"
          className={`form-button pb-2 pt-2 px-3 rounded-md text-white ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500'}`}
          onClick={onSubmit}
          disabled={isLoading}
          >{isLoading ? 'En cours...' : 'Soumettre'}</Button>
      </form>
    </div>
  );
}

function ResponseSection({
  response,
  isLoading,
}: {
  response: { pdfLink?: string; error?: string; data?: { offer: Offer } } | null;
  isLoading: boolean;
}) {
  if (!response)
    return (
      <div className="flex flex-col w-full lg:w-1/2 p-4 rounded-md bg-blue-100 ml-4">
        <h2 className="text-blue-900 font-bold mb-2">Réponse :</h2>
        <span>{isLoading ? 'Traitement en cours...' : 'Aucune réponse'}</span>
      </div>
    );

  return (
    <div className="flex flex-col w-full lg:w-1/2 p-4">
      <div className="bg-gray-100 p-4 rounded-md shadow-md">
        <h2 className="text-blue-900 font-bold mb-2">Réponse</h2>
        {response.error && <p className="text-red-500">{response.error}</p>}
        <div className="flex flex-col">
          {response.pdfLink && (
            <embed
              src={response.pdfLink}
              title="Visualiseur PDF"
              className="w-full h-80 border origin-top-left"
            />
          )}
          {response.data?.offer && (
            <div className="mb-4">
              <ul>
                <li className="mb-2">
                  <b>Titre de l’offre :</b> {response.data.offer.title}
                </li>
                <li className="mb-2">
                  <b>Entreprise :</b> {response.data.offer.company}
                </li>
                <li className="mb-2">
                  <b>Présentation :</b> {response.data.offer.company_description}
                </li>
                <li className="mb-2">
                  <b>Résumé :</b> {response.data.offer.summary}
                </li>
                <li className="mb-2">
                  <b>Recommandations :</b> {response.data.offer.recommendations}
                </li>
                <li className="mb-2">
                  <b>Publié le :</b> {response.data.offer.posted_date}
                </li>
                <li className="mb-2">
                  <b>Lien vers l’offre :</b>{' '}
                  <a href={response.data.offer.link} target="_blank" rel="noopener noreferrer">
                    Lien
                  </a>
                </li>
                <li className="mb-2">
                  <b>Télécharger le CV :</b>{' '}
                  <a href={response.pdfLink} download target="_blank" rel="noopener noreferrer">
                    Lien
                  </a>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <label className="block text-blue-900 text-sm font-bold mb-2">{label}</label>
      {children}
    </div>
  );
}

interface Offer {
  title: string;
  summary: string;
  link: string;
  company: string;
  posted_date: string;
  recommendations: string;
  company_description: string;
}
