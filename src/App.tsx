import React from "react";
import Editor, { Monaco } from "@monaco-editor/react";
import "./style.css";

const language = "javascript";
const theme = `${language}Theme`;

function App() {
  const defaultValue = "this is a {{properties.foo}} test {{";

  const onBeforeMount = (monaco: Monaco) => {
    const provideCompletionItems = (
      model: any,
      position: any
    ) => {
      const wordList = ["hello", "abc"]; // Add your desired words here
      const suggestions = wordList.map((word) => ({
        label: word,
        kind: monaco.languages.CompletionItemKind.Text,
        insertText: word,
        range: {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: position.column - 1 - word.length,
          endColumn: position.column - 1,
        },
      }));
      return { suggestions };
    };

    
    // Configure JSON IntelliSense
    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: true,
      schemas: [
        {
          uri: "http://example.com/schema.json", // Use a unique URI
          fileMatch: ["*"], // Match all files
          schema: {
            type: "object",
            properties: {
              key: {
                type: "string",
                description: "Description for key",
              },
              value: {
                type: "string",
                description: "Description for value",
              },
            },
          },
        },
      ],
    });
    
    // Register a custom language for mapping kit
    monaco.languages.register({ id: language });

    monaco.languages.setMonarchTokensProvider(language, {
      tokenizer: {
        root: [
          // Add JavaScript tokenization rules here
          [/data\.\w*/, "json-property"], // Match JSON properties
        ],
      },
    });

    // // Enable JSON syntax highlighting within JavaScript
    // monaco.languages.json.jsonDefaults.setModeConfiguration({
    //   schemas: [],
    //   validate: true,
    //   allowComments: true,
    //   allowTrailingCommas: true,
    // });

    
    monaco.languages.setLanguageConfiguration(language, {
      brackets: [
        ["{{", "}}"],
        ["{", "}"],
        ["(", ")"]
      ],
      autoClosingPairs: [
        { open: "{", close: "}" },
        { open: "(", close: ")" }
      ]
    });

    monaco.languages.setMonarchTokensProvider(language, {
      defaultToken: "",
      tokenizer: {
        root: [
          [
            /\{\{/,
            {
              token: "delimiter.curlies",
              bracket: "@open",
              next: "@curlies_block"
            }
          ]
        ],
    
        curlies_block: [
          [
            /\}\}/,
            { token: "delimiter.curlies", bracket: "@close", next: "@pop" }
          ],
          [
            /\bhello\b/, // Thêm từ "hello" vào đây để gợi ý
            { token: "curlies-variable" }
          ],
          [/./, { token: "curlies-variable" }]
        ]
      }
    });

    // Define a new theme that contains only rules that match this language
    monaco.editor.defineTheme(theme, {
      base: "vs",
      inherit: false,
      colors: {},
      rules: [
        {
          foreground: "#F9A8D4",
          token: "delimiter.curlies"
        },
        {
          token: "curlies-variable",
          foreground: "#5B21B6"
        }
      ]
    });

    try {
      console.log(monaco.editor.tokenize("yo {{ok}} {{ ", language));
    } catch (error) {
      console.error(error);
    }


    monaco.languages.registerCompletionItemProvider(language, {
      provideCompletionItems: (model, position) => {
        const lineText = model.getLineContent(position.lineNumber);

        // Check if the cursor is inside {{}}
        if (lineText.substring(position.column - 3, position.column) === "{{}}" && position.column >= 3) {
          console.log("hihi")
        }

        return provideCompletionItems(model, position);
      },
    });
    
    
  };

  return (
    <Editor
      height="50px"
      language={language}
      theme={theme}
      beforeMount={onBeforeMount}
      defaultValue={defaultValue}
      options={{
        wordWrap: "off",
        lineNumbers: "off",
        lineNumbersMinChars: 0,
        overviewRulerLanes: 0,
        overviewRulerBorder: false,
        hideCursorInOverviewRuler: true,
        lineDecorationsWidth: 0,
        glyphMargin: false,
        folding: false,
        scrollBeyondLastColumn: 0,
        scrollbar: {
          horizontal: "hidden",
          vertical: "hidden",
          alwaysConsumeMouseWheel: false
        },
        matchBrackets: "never",
        minimap: { enabled: false },
        wordBasedSuggestions: false,
        links: false,
        occurrencesHighlight: false,
        contextmenu: false,
        autoClosingBrackets: "languageDefined",
        autoSurround: "languageDefined",
        readOnly: false,
        lineHeight: 20,
        suggestLineHeight: 34,
        rulers: [],
        quickSuggestions: false,
        fixedOverflowWidgets: true,
        fontSize: 14,
        fontFamily:
          "sfmono-regular, consolas, menlo, dejavu sans mono, monospace"
      }}
    />
  );
}

export default App;
