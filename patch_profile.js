const fs = require('fs');
let code = fs.readFileSync('src/pages/Profile.tsx', 'utf8');

// Add AlertDialog imports
const importRegex = /import \{ useAuth \} from '@\/context\/AuthContext';/;
code = code.replace(importRegex, `import { useAuth } from '@/context/AuthContext';\nimport { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';`);

// Replace sign out button with AlertDialog
const signOutRegex = /<button[\s\S]*?onClick=\{\(\) => void signOut\(\)\}[\s\S]*?Sair da conta\s*<\/button>/;
const signOutReplacement = `<AlertDialog>
                <AlertDialogTrigger asChild>
                  <button type="button" className="btn-premium justify-center sm:w-auto">
                    <LogOut className="h-4 w-4" />
                    Sair da conta
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Tem certeza que deseja sair?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Sua sessão será encerrada e você precisará fazer login novamente para acessar sua conta.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => void signOut()}>Sair</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>`;

code = code.replace(signOutRegex, signOutReplacement);

fs.writeFileSync('src/pages/Profile.tsx', code);
