import Intro from './components/Intro';

const IntroTest = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#eceff4',
        flex: 1,
        fontSize: 100,
        backgroundColor: '#2e3440'
      }}
    >
      <Intro />
    </div>
  );
};

export default IntroTest;
