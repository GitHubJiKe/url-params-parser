'use client'
import { useRef, useState, useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import qs from 'query-string'
import JSONEditor, { type JSONEditorOptions } from 'jsoneditor'
import "jsoneditor/dist/jsoneditor.min.css";
import { useToast } from "@/hooks/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { FaCopy } from "react-icons/fa";
function isValidURL(string: string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

async function copyToClipboard(text: string) {
  return navigator.clipboard.writeText(text)
}

const jsoneditorOptions: JSONEditorOptions = {
  mode: 'tree'
}

export default function Home() {
  const [url, setUrl] = useState<string>('')
  const [paramStr, setParamsStr] = useState<string>('')
  const [urlObj, setURLObj] = useState<URL>()
  const coderRef = useRef<HTMLDivElement>(null)
  const jsonEditor = useRef<JSONEditor>()
  const { toast } = useToast()
  useEffect(() => {
    jsonEditor.current = new JSONEditor(coderRef.current!, jsoneditorOptions)
  }, []);



  const doParse = () => {
    const obj = qs.parse(url || paramStr)

    if (url) {
      setURLObj(new URL(url))
    }

    if (jsonEditor.current) {
      console.log(obj);
      jsonEditor.current.set(JSON.parse(JSON.stringify(obj)))
    }
  }

  const doCopy = async (text: string) => {
    try {
      await copyToClipboard(text)
      toast({ title: 'Congratulations!', description: 'Copied!' })

    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Oops!',
        description: 'So sorry, copy failed',
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      })
    }
  }

  const fullUrl = urlObj ? urlObj?.origin + urlObj?.pathname : ''

  return (<>
    <h1 className="p-6  text-center text-4xl font-extrabold tracking-tight lg:text-5xl">
      Parse URL Query Params to JSON
    </h1>

    <main className="flex w-full items-center justify-between gap-6 p-6">
      <section className="flex-1">
        <Textarea
          rows={8}
          placeholder="Type your url here."
          onChange={(event) => {
            const _url = event.currentTarget.value.trim()
            if (isValidURL(_url)) {
              setUrl(_url)
            } else {
              setParamsStr(_url)
            }
          }} />
        <Button className="mt-6 w-full" onClick={doParse}>Parse</Button>
      </section>
      <div className="flex-1">
        {urlObj && <p className="mb-3 flex flex-row justify-between items-center pr-6">
          {urlObj?.origin}
          {urlObj?.pathname}
          <FaCopy className="cursor-pointer" onClick={() => doCopy(fullUrl)} />
        </p>
        }
        <div ref={coderRef} className="max-h-fit w-full rounded">
        </div>
        <Button className="mt-6 w-full" onClick={() => {
          if (jsonEditor.current) {
            doCopy(JSON.stringify(jsonEditor.current.get(), null, 4))
          }
        }
        }>
          Copy
        </Button>
      </div>
    </main>
  </>
  );
}
