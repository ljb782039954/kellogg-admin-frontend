import type { ComponentType } from 'react';
import type { AdminScreenProps } from '@/core/contracts';
import { ProductEditorContainer } from './ProductEditorContainer';

export { ProductEditorContainer, ProductEditorContainer as ProductsEditor } from './ProductEditorContainer';

export const ProductsScreen: ComponentType<AdminScreenProps> =
  function ProductsScreen() {
    return <ProductEditorContainer />;
  };
