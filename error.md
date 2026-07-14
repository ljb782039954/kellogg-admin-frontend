src/site-package/kellogg/Management/pageBuilder/BlockPropsEditor.tsx:85:39 - error TS2352: Conversion of type 'Record<string, unknown>' to type 'TableContent' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.
  Type 'Record<string, unknown>' is missing the following properties from type 'TableContent': columns, rows

85       return <TablePropsEditor props={content as TableContent} onUpdate={onUpdate} />;
                                         ~~~~~~~~~~~~~~~~~~~~~~~

src/site-package/lilian/Management/pageBuilder/BlockPropsEditor.tsx:27:37 - error TS2352: Conversion of type 'Record<string, unknown>' to type 'TableContent' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.
  Type 'Record<string, unknown>' is missing the following properties from type 'TableContent': columns, rows

27     return <TablePropsEditor props={content as TableContent} onUpdate={onUpdate} />;