import logoLoading from '../../../assets/images/Logo.svg'
import './Loading.css'

export default function Loading() {
  return (
    <>
      <section className='bodyLoading'>
        <div className='logoLoading'>
          <img src={logoLoading} alt="" />
        </div>
        <div className='spanCarregando'>
          <span className="carregando"></span>

          <p>Aguarde, isso pode levar alguns instantes...</p>
        </div>
      </section>

    </>
  )
}