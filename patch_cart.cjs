const fs = require('fs');
let code = fs.readFileSync('src/pages/Cart.tsx', 'utf8');

// Add AlertDialog imports
const importRegex = /import \{ useCartStore \} from '@\/store\/cartStore';/;
code = code.replace(importRegex, `import { useCartStore } from '@/store/cartStore';\nimport { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';\nimport { useState } from 'react';`);

const removeItemRegex = /<button[\s\S]*?onClick=\{\(\) => removeItem\(item\.product_id\)\}[\s\S]*?aria-label=\{t\('common\.remove'\)\}[\s\S]*?<\/button>/g;

// Since we'll need to wrap it, let's use a function and local state
// Wait, we can't easily add local state per item without a separate component, 
// BUT we can map the items inside Cart.tsx. Alternatively, we can just use the standard AlertDialog wrapping the button directly.
// Wait, AlertDialog with Trigger works out of the box per item.

const replacement = `<AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button
                              className="rounded-full p-2 text-muted-foreground transition-colors hover:text-destructive"
                              aria-label={t('common.remove')}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remover do carrinho?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja remover este item do seu carrinho?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => removeItem(item.product_id)}>Remover</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>`;

code = code.replace(removeItemRegex, replacement);

const clearCartRegex = /<button onClick=\{clearCart\} className="w-full text-center text-xs font-body text-muted-foreground hover:text-destructive mt-3 transition-colors">\s*\{t\('common\.clearCart'\)\}\s*<\/button>/;

const clearCartReplacement = `<AlertDialog>
                <AlertDialogTrigger asChild>
                  <button className="w-full text-center text-xs font-body text-muted-foreground hover:text-destructive mt-3 transition-colors">
                    {t('common.clearCart')}
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Esvaziar carrinho?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja remover todos os itens do carrinho? Esta ação não pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={clearCart}>Esvaziar Carrinho</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>`;

code = code.replace(clearCartRegex, clearCartReplacement);

fs.writeFileSync('src/pages/Cart.tsx', code);
