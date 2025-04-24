import { useState, useEffect } from 'react';

interface JSONFormatterProps {
  className?: string;
}

const JSONFormatter = ({ className = '' }: JSONFormatterProps) => {
  const [inputText, setInputText] = useState<string>('');
  const [outputText, setOutputText] = useState<string>('');
  const [indentSize, setIndentSize] = useState<number>(2);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [isFormatting, setIsFormatting] = useState<boolean>(false);

  const formatJSON = () => {
    try {
      if (!inputText.trim()) {
        setOutputText('');
        setError(null);
        return;
      }
      
      setIsFormatting(true);
  
      setTimeout(() => {
        try {
          const parsedJSON = JSON.parse(inputText);
          const formattedJSON = JSON.stringify(parsedJSON, null, indentSize);
          setOutputText(formattedJSON);
          setError(null);
        } catch (err) {
          setError(`Error al analizar JSON: ${(err as Error).message}`);
          setOutputText('');
        } finally {
          setIsFormatting(false);
        }
      }, 300);
      
    } catch (err) {
      setError(`Error al analizar JSON: ${(err as Error).message}`);
      setOutputText('');
      setIsFormatting(false);
    }
  };

  const clearFields = () => {
    setInputText('');
    setOutputText('');
    setError(null);
  };

  const copyToClipboard = () => {
    if (outputText) {
      navigator.clipboard.writeText(outputText);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  // Auto-format JSON on input change
  useEffect(() => {
    if (inputText.trim()) {
      const timer = setTimeout(() => {
        try {
          setIsFormatting(true);
          const parsedJSON = JSON.parse(inputText);
          const formattedJSON = JSON.stringify(parsedJSON, null, indentSize);
          setOutputText(formattedJSON);
          setError(null);
        } catch (err) {
          // Silent handling for auto-format
        } finally {
          setIsFormatting(false);
        }
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [inputText, indentSize]);

  return (
    <div className={`w-full max-w-5xl mx-auto p-6 ${className}`}>
      <h1 className="text-2xl font-light text-center mb-10 text-dark">
        <span className="font-light">Bliv</span>
        <span className="font-semibold text-primary">Formatt</span>
        <span className="font-light"> | Formateador JSON</span>
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h2 className="text-sm font-medium text-gray-600">JSON de Entrada</h2>
            <button 
              onClick={clearFields}
              className="text-xs px-3 py-1 rounded-full text-gray-500 hover:bg-gray-200 transition-colors"
              aria-label="Limpiar"
            >
              Limpiar
            </button>
          </div>
          <textarea
            className="w-full h-80 p-5 font-mono text-sm border-none resize-none focus:outline-none focus:ring-0 bg-white"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Pega tu JSON aquí..."
            spellCheck="false"
          />
        </div>
        
        <div className="flex flex-col bg-white rounded-xl shadow-sm overflow-hidden relative">
          <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <div className="flex items-center">
              <h2 className="text-sm font-medium text-gray-600">JSON Formateado</h2>
              {isFormatting && (
                <div className="ml-2 flex items-center">
                  <div className="animate-pulse flex space-x-1">
                    <div className="h-1.5 w-1.5 bg-primary rounded-full"></div>
                    <div className="h-1.5 w-1.5 bg-primary rounded-full"></div>
                    <div className="h-1.5 w-1.5 bg-primary rounded-full"></div>
                  </div>
                </div>
              )}
            </div>
            <button 
              onClick={copyToClipboard}
              disabled={!outputText || isFormatting}
              className={`text-xs px-3 py-1 rounded-full transition-colors ${
                outputText && !isFormatting
                  ? copySuccess
                    ? 'bg-green-100 text-green-600'
                    : 'text-gray-500 hover:bg-gray-200' 
                  : 'text-gray-400 cursor-not-allowed'
              }`}
            >
              {copySuccess ? 'Copiado!' : 'Copiar'}
            </button>
          </div>
          <textarea
            className="w-full h-80 p-5 font-mono text-sm border-none resize-none focus:outline-none focus:ring-0 bg-gray-50"
            value={outputText}
            readOnly
            placeholder="El JSON formateado aparecerá aquí..."
            spellCheck="false"
          />
          
          {isFormatting && (
            <div className="absolute inset-0 bg-gray-50 bg-opacity-70 flex items-center justify-center z-10">
              <div className="flex flex-col items-center">
                <div className="mb-3 relative w-12 h-12">
                  <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin"></div>
                  <div className="absolute inset-1 rounded-full border-2 border-gray-100"></div>
                </div>
                <p className="text-xs text-gray-600 font-medium">Formateando...</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {error && (
        <div className="mt-4 p-3 text-sm bg-red-50 text-red-600 rounded-lg border border-red-100 shadow-sm">
          {error}
        </div>
      )}
      
      <div className="mt-8 flex justify-center items-center gap-6">
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500">Indentación:</span>
          <div className="flex items-center space-x-2">
            {[2, 4, 8].map((size) => (
              <button
                key={size}
                onClick={() => setIndentSize(size)}
                className={`w-9 h-9 flex items-center justify-center text-xs font-semibold rounded-md focus:outline-none border-2 transition-all ${
                  indentSize === size
                    ? 'border-primary bg-blue-100 text-blue-800'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                }`}
                aria-pressed={indentSize === size}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
        
        <button
          onClick={formatJSON}
          disabled={isFormatting}
          className={`px-6 py-2.5 rounded-md text-sm font-semibold shadow-sm transition-colors ${
            isFormatting 
              ? 'bg-gray-300 text-gray-600 cursor-not-allowed' 
              : 'bg-green-100 text-green-800 border-2 border-green-500 hover:bg-green-200'
          }`}
          aria-busy={isFormatting}
        >
          {isFormatting ? 'Formateando...' : 'Formatear'}
        </button>
      </div>
    </div>
  );
};

export default JSONFormatter; 