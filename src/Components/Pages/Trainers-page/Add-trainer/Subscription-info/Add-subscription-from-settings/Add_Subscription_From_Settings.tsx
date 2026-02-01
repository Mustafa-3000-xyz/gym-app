import styled from 'styled-components';
// ========================================================== //
export default function Add_Subscription_From_Settings() {
    return <div className='flex justify-center mb-3'>
        <StyledWrapper className=' w-3/4'>
            <button className="btn-96 w-full font-bold">
                <span className='border border-slate-200'>
                    قائمة الإشتراكات 
                </span>
            </button>
        </StyledWrapper>
    </div>
}



const StyledWrapper = styled.div`
    .btn-96 {
        -webkit-tap-highlight-color: transparent;
        color: #fff;
        cursor: pointer;
        font-size: 100%;
        line-height: 1.5;
    }

    .btn-96 {
        display: block;
        padding: 20px 5rem;
        position: relative;
    }

    .btn-96 span {
        background: #fff;
        color: #000;
        display: grid;
        inset: 0;
        place-items: center;
        position: absolute;
        transform: rotateX(0deg);
        transform-origin: top center;
        transition: 0.2s;
    }

    .btn-96:hover span {
        transform: rotateX(35deg);
    }

    .btn-96:after{
        background: #ccc;
        content: "";
        height: 100%;
        left: 0;
        position: absolute;
        top: 0;
        width: 100%;
        z-index: -1;
        transition: all 1s;
    }
`;