import { useState, useEffect } from 'react';
import { supabase } from '../../../supabase';

export function useChatFilter() {
  const [forbiddenWords, setForbiddenWords] = useState<string[]>([]);

  //Cargar palabras
  useEffect(() => {
    const fetchWords = async () => {
      const { data } = await supabase.from('forbidden_words').select('word');
      if (data) {
        setForbiddenWords(data.map(d => d.word.toLowerCase()));
      }
    };
    fetchWords();

    const channel = supabase.channel('words_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'forbidden_words' }, fetchWords)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const censorMessage = (text: string): string => {
    if (!text || forbiddenWords.length === 0) return text;
    
    let cleanText = text;
    forbiddenWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      //Reemplazo por *
      cleanText = cleanText.replace(regex, '*'.repeat(word.length));
    });
    
    return cleanText;
  };

  return { censorMessage };
}