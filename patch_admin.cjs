const fs = require('fs');
let code = fs.readFileSync('src/components/layout/AdminLayout.tsx', 'utf8');

// Add AlertDialog imports
const importRegex = /import \{ useAuth \} from '@\/context\/AuthContext';/;
code = code.replace(importRegex, `import { useAuth } from '@/context/AuthContext';\nimport { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';`);

// Replace sign out button with AlertDialog
const signOutRegex = /<button[\s\S]*?onClick=\{\(\) => void signOut\(\)\}[\s\S]*?Sair do admin\s*<\/button>/;
const signOutReplacement = `<AlertDialog>
                <AlertDialogTrigger asChild>
                  <button type="button" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-body text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                    <LogOut className="w-4 h-4" />
                    Sair do admin
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Tem certeza que deseja sair?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Sua sessão de administrador será encerrada.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => void signOut()}>Sair</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>`;

code = code.replace(signOutRegex, signOutReplacement);

fs.writeFileSync('src/components/layout/AdminLayout.tsx', code);
