src/core-adminApp/ui/Management/pageBuilder/PageLayoutEditor.tsx:217:17 - error TS2322: Type 'CmsPageBlock<string, unknown>' is not assignable to type 'PageBlock'.
  Type 'string' is not assignable to type 'keyof BlockContentMap'.

217                 block={selectedBlock}
                    ~~~~~

  src/site-package/kellogg/Management/pageBuilder/BlockPropsEditor.tsx:56:3
    56   block: PageBlock;
         ~~~~~
    The expected type comes from property 'block' which is declared here on type 'IntrinsicAttributes & BlockPropsEditorProps'

src/core-adminApp/ui/Management/pageBuilder/PageLayoutEditor.tsx:238:9 - error TS2322: Type 'CmsPageBlock<string, unknown>[]' is not assignable to type '{ type: keyof BlockContentMap; }[]'.
  Type 'CmsPageBlock<string, unknown>' is not assignable to type '{ type: keyof BlockContentMap; }'.
    Types of property 'type' are incompatible.
      Type 'string' is not assignable to type 'keyof BlockContentMap'.

238         existingBlocks={localPage.blocks}
            ~~~~~~~~~~~~~~

  src/core-adminApp/ui/Management/pageBuilder/AddBlockDialog.tsx:28:3
    28   existingBlocks: { type: BlockType }[];
         ~~~~~~~~~~~~~~
    The expected type comes from property 'existingBlocks' which is declared here on type 'IntrinsicAttributes & AddBlockDialogProps'

src/core-adminApp/ui/Management/product/ProductsEditor.tsx:47:5 - error TS2322: Type 'string' is not assignable to type 'Language'.

47     language,
       ~~~~~~~~

  src/core-adminApp/items/product/useProductsEditor.ts:16:3
    16   language: Language;
         ~~~~~~~~
    The expected type comes from property 'language' which is declared here on type 'UseProductsEditorOptions'


Found 3 errors.