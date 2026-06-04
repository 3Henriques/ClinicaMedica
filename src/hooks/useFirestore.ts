import { useState } from "react";
import firebase from "firebase/compat/app";
import { collection, addDoc, onSnapshot, query, QueryConstraint } from "firebase/firestore";

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
    };

    const escutar = (callback: (dados: any[]) => void, ...filtros: QueryConstraint[]) => {
        const q = query(collection(db, nomeColecao), ...filtros);
        const cancelar = onSnapshot(q, (snapshot) => {
            const dados = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            callback(dados);
        }, (err) => {
            console.error("Erro no listener Firestore: ", err);
        });
        return cancelar;
    };


    return { adicionar, escutar, carregando};
}