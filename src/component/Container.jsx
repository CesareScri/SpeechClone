import React, { useEffect, useState } from 'react';
import NavBar from './NavBar';
import Result from './Result';
import UploadFile from './UploadFile';
import WriteText from './WriteText';

const Container = () => {
  const [file, setFile] = useState(null);
  const [input, setInput] = useState(null);
  const [currentPage, setCurrentPage] = useState(0); // 0 for UploadFile, 1 for WriteText
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    if (file) {
      console.log(file);
      setCurrentPage(1); // Switch to WriteText when a file is uploaded
    }
  }, [file]);

  useEffect(() => {
    setInput(input)
  }, [input]);

  useEffect(() => {
    console.log(data)
  }, [data]);


  const components = [<UploadFile setFile={setFile} />, <WriteText setCurrentPage={setCurrentPage} setInput={setInput} file={file}  setData={setData} isLoading={isLoading} setIsLoading={setIsLoading}/>, <Result setCurrentPage={setCurrentPage} input={input} dataId={data && data.data ? data.data.id : null} setIsLoading={setIsLoading}/>];

  return (
    <div className='container'>
      {components[currentPage]}
      
    </div>
  );
}

export default Container;
