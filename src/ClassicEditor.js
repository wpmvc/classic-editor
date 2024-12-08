import { useEffect, useRef, useMemo, useState } from '@wordpress/element';
import EditorWrapper from './EditorWrapper';

const ClassicEditor = ( {
	value,
	onChange,
	height = 250,
	useExtendStyles = false, // Pass this prop to control extended styles,
	hasMedia = true,
} ) => {
	const [ isEditorReady, setIsEditorReady ] = useState( false );
	const editorRef = useRef( null );

	const editorId = useMemo(
		() => `wp_editor_${ Date.now() + parseInt( Math.random() * 1000 ) }`,
		[]
	);

	const hasWpEditor = !! window.wp?.editor;

	const setupEditor = ( editor ) => {
		editorRef.current = editor; // Store the editor instance

		editor.on( 'init', () => {
			editor.setContent( value ); // Set initial content when TinyMCE is ready
		} );

		// Handle content changes
		editor.on( 'change', () => {
			onChange( editor.getContent() );
		} );

		setIsEditorReady( true );
	};

	const initEditor = () => {
		// Clean up any previous instance
		window.wp.editor.remove( editorId );

		// Initialize TinyMCE editor
		window.wp.editor.initialize( editorId, {
			tinymce: {
				height,
				toolbar1:
					'formatselect,table,bold,italic,bullist,numlist,link,blockquote,alignleft,aligncenter,alignright,underline,strikethrough,forecolor,removeformat,codeformat,outdent,indent,undo,redo',
				menubar: false,
				setup: setupEditor,
			},
			quicktags: true,
			mediaButtons: hasMedia,
		} );
	};

	useEffect( () => {
		if ( editorRef.current && value !== editorRef.current.getContent() ) {
			editorRef.current.setContent( value ); // Update editor content if value changes from outside
		}
	}, [ value ] );

	useEffect( () => {
		if ( isEditorReady ) {
			setTimeout( () => {
				editorRef.current.setContent( value );
			}, 500 );
		}
	}, [ isEditorReady ] );

	useEffect( () => {
		if ( hasWpEditor ) {
			initEditor();
		}

		// Cleanup when component unmounts
		return () => {
			if ( hasWpEditor ) {
				window.wp.editor.remove( editorId );
			}
		};
	}, [ hasWpEditor ] );

	return (
		<EditorWrapper extend={ useExtendStyles.toString() }>
			<textarea className="wpmvc-classic-editor" id={ editorId } />
		</EditorWrapper>
	);
};

export default ClassicEditor;
