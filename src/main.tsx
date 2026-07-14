import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@site/styles/index.css'
import '@site/ui-display/styles/global.css'
import App from './App.tsx'
import { applyDocumentMetadata } from '@/core-adminApp/app/documentMetadata'
import documentMetadata from '@site/metadata/documentMeta'

applyDocumentMetadata(documentMetadata)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
