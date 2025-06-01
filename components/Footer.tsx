import Link from "next/link"
import Image from "next/image"

type FooterProps = {
  setShowLoginModal: (show: boolean) => void
}

export function Footer({ setShowLoginModal }: FooterProps) {
  return (
    <footer className="bg-black text-white py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Serviços</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="text-gray-400 hover:text-white transition-colors text-left"
                >
                  Conta corrente
                </button>
              </li>
              <li>
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="text-gray-400 hover:text-white transition-colors text-left"
                >
                  Conta PJ
                </button>
              </li>
              <li>
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="text-gray-400 hover:text-white transition-colors text-left"
                >
                  Cartão de crédito
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contato</h3>
            <ul className="space-y-2">
              <li className="text-gray-400">0800 004 250 08</li>
              <li className="text-gray-400">meajuda@bytebank.com.br</li>
              <li className="text-gray-400">ouvidoria@bytebank.com.br</li>
            </ul>
          </div>

          <div className="flex flex-col gap-6">
            <h3 className="text-lg font-semibold">Desenvolvido por Alura</h3>
            <Image src="/logos/logo-white.svg" alt="Bytebank" width={146} height={32} />
            <div className="flex items-center space-x-4">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Image src="/landing/instagram.svg" alt="Instagram" width={29} height={29} />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Image src="/landing/whatsapp.svg" alt="Whatsapp" width={29} height={29} />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Image src="/landing/youtube.svg" alt="Youtube" width={30} height={21} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}