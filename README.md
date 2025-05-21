# iOS Interview Take-Home Assignment

## Instruction 
Please remove `.txt` file extension for the following files before you start
- metro.config.js.txt
- react-native-config.js.txt
- index.js.txt

## Overview
This project is a React Native + iOS native hybrid application that displays cryptocurrency prices. Your task is to implement several key features while demonstrating best practices in both React Native and iOS development.

## What to Do
1. Implement functionality to display the Both USD and EUR price in the UI.  
   1.1 The ability to show the EUR price is controlled by the feature flag `Support EUR`, located in the Settings page (`SettingViewController`).  
   1.2 When the flag is **off**, fetch price list data with `USDPriceUseCase`.  
   1.3 When the flag is **on**, fetch price list data with `AllPriceUseCase`.  
      - 1.3.1 When the EUR price is available, append it after the USD price in the list, e.g., `USD: 123.45 EUR: 678.91`.  

## Tasks

### 1. React Native Component
- Implement embedded React Native component (PriceList.tsx) into RNListViewController to display the cryptocurrency price list
   - PriceList has been registered under `AppRegistry.registerComponent('CDC_Interview', () => App);`
- Implement Loading State for fetchList
- Implement Error State for fetchList

### 2. Turbo Module Implementation
- (NativeInterviewModule) Turbo Module is declared under `specs` directory
- Implement price list fetching in RCTNativeInterviewModule
   - Taking feature flag mentioned in *What to Do* into consideration to determine the data source
   - Handle both USD and EUR price display accordingly
- Implement error handling

### 3. Unit Testing
- Unit test fetch Price List with feature flag 
- Unit test cover error cases
- Unit test on both iOS and React Native 

### 4. UI Performance Optimization (Optional)
- Implement smooth scrolling and efficient list rendering
- Feel free to improve or modify the price list UI

## Project Structure
- `app/` - React Native components and hooks
- `ios/` - Native iOS implementation
  - `RCTNativeInterviewModule` - Turbo Module 
  - `RCTNativeInterviewEventsEmitterModule` - Event emitter 
  - `SceneDelegate.swift` - App lifecycle and React Native setup
- `specs/` - TypeScript interfaces and type definitions

## Getting Started
1. Install dependencies:
   ```bash
   yarn install
   cd ios/CDC_Interview && pod install
   ```

2. Run the project:
   ```bash
   yarn ios
   ```

## Submission
Please develop your solution using git with regular commits to document your progress and thought process. When complete:

1. Zip the entire project directory (excluding node_modules and build folders)
2. Submit the zip file along with a summary that includes:
   - Implementation details
   - Performance considerations
   - Any assumptions made
   - Future improvements
   - Any other supplements

Your commits should reflect your normal development workflow and help us understand how you approached the assignment.