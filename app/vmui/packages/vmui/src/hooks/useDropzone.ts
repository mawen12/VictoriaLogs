import { useState, useRef } from "preact/compat";
import useEventListener from "./useEventListener";

/**
 * 封装全局拖拽/粘贴导入文件
 * 
 * @returns 
 */
const useDropzone = (): { dragging: boolean, files: File[] } => {
  // 维护当前收到的文件列表
  const [files, setFiles] = useState<File[]>([]);
  // 维护当前是否推拽悬停状态
  const [dragging, setDragging] = useState(false);
  
  const bodyRef = useRef(document.body);

  const handleAddFiles = (fileList: FileList) => {
    const filesArray = Array.from(fileList || []);
    // 覆盖原先文件，非追加
    setFiles(filesArray);
  };

  // handle drag events
  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      // 拖进来或悬停
      setDragging(true);
    } else if (e.type === "dragleave") {
      // 离开
      setDragging(false);
    }
  };

  // triggers when file is dropped
  // 拖拽放下文件的行为
  const handleDrop = (e: DragEvent) => {
    // 阻止默认行为
    e.preventDefault();
    e.stopPropagation();

    setDragging(false);
    // 把 dataTransfer.files 写入 files
    if (e?.dataTransfer?.files && e.dataTransfer.files[0]) {
      handleAddFiles(e.dataTransfer.files);
    }
  };

  // triggers when file is pasted
  const handlePaste = (e: ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    const jsonFiles = Array.from(items)
      // 仅接收 application/json
      .filter(item => item.type === "application/json")
      .map(item => item.getAsFile())
      .filter(file => file !== null) as File[];
    setFiles(jsonFiles);
  };

  // 监听 body 上的 dragenter/dragleave/dragover/drop/paste 实现全面接收
  useEventListener("dragenter", handleDrag, bodyRef);
  useEventListener("dragleave", handleDrag, bodyRef);
  useEventListener("dragover", handleDrag, bodyRef); 
  useEventListener("drop", handleDrop, bodyRef); // 拖拽结束：任意文件
  useEventListener("paste", handlePaste, bodyRef); // 粘贴：仅 application/json 文件

  return {
    files,
    dragging,
  };
};

export default useDropzone;
