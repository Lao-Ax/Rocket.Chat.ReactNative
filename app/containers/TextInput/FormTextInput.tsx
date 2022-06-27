import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import React from 'react';
import { StyleProp, StyleSheet, Text, TextInput as RNTextInput, TextInputProps, TextStyle, View, ViewStyle } from 'react-native';
import Touchable from 'react-native-platform-touchable';

import { themes } from '../../lib/constants';
import { TSupportedThemes } from '../../theme';
import sharedStyles from '../../views/Styles';
import ActivityIndicator from '../ActivityIndicator';
import { CustomIcon, TIconsName } from '../CustomIcon';
import TextInput from './index';

const styles = StyleSheet.create({
	error: {
		...sharedStyles.textAlignCenter,
		paddingTop: 5
	},
	inputContainer: {
		marginBottom: 10
	},
	label: {
		marginBottom: 10,
		fontSize: 14,
		...sharedStyles.textSemibold
	},
	input: {
		...sharedStyles.textRegular,
		height: 48,
		fontSize: 16,
		padding: 14,
		borderWidth: StyleSheet.hairlineWidth,
		borderRadius: 2
	},
	inputIconLeft: {
		paddingLeft: 45
	},
	inputIconRight: {
		paddingRight: 45
	},
	wrap: {
		position: 'relative'
	},
	iconContainer: {
		position: 'absolute',
		top: 14
	},
	iconLeft: {
		left: 15
	},
	iconRight: {
		right: 15
	}
});

export interface IRCTextInputProps extends TextInputProps {
	label?: string;
	error?: any;
	loading?: boolean;
	containerStyle?: StyleProp<ViewStyle>;
	inputStyle?: StyleProp<TextStyle>;
	inputRef?: React.Ref<RNTextInput>;
	testID?: string;
	iconLeft?: TIconsName;
	iconRight?: TIconsName;
	left?: JSX.Element;
	theme: TSupportedThemes;
	bottomSheet?: boolean;
	onClearInput?: () => void;
}

interface IRCTextInputState {
	showPassword: boolean;
}

export default class FormTextInput extends React.PureComponent<IRCTextInputProps, IRCTextInputState> {
	static defaultProps = {
		error: {},
		theme: 'light'
	};

	state = {
		showPassword: false
	};

	get iconLeft() {
		const { testID, iconLeft, theme } = this.props;
		return iconLeft ? (
			<CustomIcon
				name={iconLeft}
				testID={testID ? `${testID}-icon-left` : undefined}
				size={20}
				color={themes[theme].auxiliaryText}
				style={[styles.iconContainer, styles.iconLeft]}
			/>
		) : null;
	}

	get iconRight() {
		const { iconRight, theme, onClearInput, value } = this.props;
		if (onClearInput && value && value.length > 0) {
			return (
				<Touchable onPress={onClearInput} style={[styles.iconContainer, styles.iconRight]} testID='clear-text-input'>
					<CustomIcon name='input-clear' size={20} color={themes[theme].auxiliaryTintColor} />
				</Touchable>
			);
		}

		return iconRight ? (
			<CustomIcon
				name={iconRight}
				size={20}
				color={themes[theme].auxiliaryText}
				style={[styles.iconContainer, styles.iconRight]}
			/>
		) : null;
	}

	get iconPassword() {
		const { showPassword } = this.state;
		const { testID, theme } = this.props;
		return (
			<Touchable onPress={this.tooglePassword} style={[styles.iconContainer, styles.iconRight]}>
				<CustomIcon
					name={showPassword ? 'unread-on-top' : 'unread-on-top-disabled'}
					testID={testID ? `${testID}-icon-right` : undefined}
					size={20}
					color={themes[theme].auxiliaryText}
				/>
			</Touchable>
		);
	}

	get loading() {
		const { theme } = this.props;
		return <ActivityIndicator style={[styles.iconContainer, styles.iconRight]} color={themes[theme].bodyText} />;
	}

	tooglePassword = () => {
		this.setState(prevState => ({ showPassword: !prevState.showPassword }));
	};

	render() {
		const { showPassword } = this.state;
		const {
			label,
			left,
			error,
			loading,
			secureTextEntry,
			containerStyle,
			inputRef,
			iconLeft,
			iconRight,
			inputStyle,
			testID,
			placeholder,
			theme,
			bottomSheet,
			...inputProps
		} = this.props;
		const { dangerColor } = themes[theme];
		const Input = bottomSheet ? BottomSheetTextInput : TextInput;
		return (
			<View style={[styles.inputContainer, containerStyle]}>
				{label ? (
					<Text style={[styles.label, { color: themes[theme].titleText }, error?.error && { color: dangerColor }]}>{label}</Text>
				) : null}
				<View style={styles.wrap}>
					<Input
						style={[
							styles.input,
							iconLeft && styles.inputIconLeft,
							(secureTextEntry || iconRight) && styles.inputIconRight,
							{
								backgroundColor: themes[theme].backgroundColor,
								borderColor: themes[theme].separatorColor,
								color: themes[theme].titleText
							},
							error?.error && {
								color: dangerColor,
								borderColor: dangerColor
							},
							inputStyle
						]}
						// @ts-ignore
						ref={inputRef} // bottomSheetRef overlap default ref
						autoCorrect={false}
						autoCapitalize='none'
						underlineColorAndroid='transparent'
						secureTextEntry={secureTextEntry && !showPassword}
						testID={testID}
						accessibilityLabel={placeholder}
						placeholder={placeholder}
						theme={theme}
						{...inputProps}
					/>
					{iconLeft ? this.iconLeft : null}
					{iconRight ? this.iconRight : null}
					{secureTextEntry ? this.iconPassword : null}
					{loading ? this.loading : null}
					{left}
				</View>
				{error && error.reason ? <Text style={[styles.error, { color: dangerColor }]}>{error.reason}</Text> : null}
			</View>
		);
	}
}