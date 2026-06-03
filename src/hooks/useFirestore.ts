import { useState } from "react";
import firebase from "firebase/compat/app";
import { collection, addDoc } from "firebase/firestore";

export function useFirestore(db: any, nomeColecao: string){
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState(null);

    const adicionar = async (dados: any) => {
        setCarregando(true);
        setErro(null);

        try{
            
            const doc = await addDoc(
                collection(db, nomeColecao),
                {
                    ...dados
                });
            
            return doc.id;
        } catch (err: any) {
            console.error("Erro ao adicionar documento: ", err);
            throw err;
        } finally {
            setCarregando(false)
        }
    }
    return adicionar;
}