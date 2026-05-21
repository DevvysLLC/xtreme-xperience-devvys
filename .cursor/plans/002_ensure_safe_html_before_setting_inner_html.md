# Ensure safe html before setting inner HTML
- review: @src/components/global-form-dialog/index.tsx:22-40
- move this to a helper in src/utils
- find any occurances of dangerouslySetInnerHTML
- return an error if the html string is unsafe
