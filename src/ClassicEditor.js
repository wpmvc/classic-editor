import { useEffect, useRef, useMemo } from '@wordpress/element';
import EditorWrapper from './EditorWrapper';

const ClassicEditor = ( {
	value,
	onChange,
	height = 250,
	useExtendStyles = false, // Pass this prop to control extended styles,
	hasMedia = true,
} ) => {
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
		if (
			editorRef.current &&
			value !== editorRef.current.getContent()
		) {
			editorRef.current.setContent( value ); // Update editor content if value changes from outside
		}
	}, [ value ] );

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